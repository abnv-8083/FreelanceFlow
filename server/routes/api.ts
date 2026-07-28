import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Client from '../models/Client.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import PasswordResetRequest from '../models/PasswordResetRequest.js';
import { connectDB } from '../config/db.js';
import { sendFreelancerCredentialsEmail, sendPasswordResetApprovalEmail } from '../utils/emailService.js';

dotenv.config();

const router = Router();

// DB & Service Health Status
router.get('/health', (req: Request, res: Response) => {
  const isConnected = mongoose.connection.readyState === 1;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const hasEmail = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

  res.json({
    status: 'ok',
    database: isConnected ? 'MongoDB Atlas Connected' : 'Local Persistence Mode',
    host: mongoose.connection.host || 'none',
    hasGeminiKey: !!geminiKey,
    hasNodemailerConfigured: hasEmail,
    emailUser: process.env.EMAIL_USER || 'Not Configured in .env',
    timestamp: new Date().toISOString()
  });
});

// Test/Connect MongoDB Atlas Endpoint
router.post('/connect-db', async (req: Request, res: Response) => {
  const { mongoUri } = req.body;
  if (!mongoUri) {
    return res.status(400).json({ success: false, message: 'MongoDB Atlas URI is required' });
  }

  const result = await connectDB(mongoUri);
  if (result.success) {
    res.json({ success: true, message: 'Successfully connected to MongoDB Atlas!', host: result.host });
  } else {
    res.status(500).json({ success: false, message: `MongoDB Atlas Connection Error: ${result.error}` });
  }
});

// ==========================================
// AUTHENTICATION & USER MANAGEMENT ENDPOINTS
// ==========================================

// Login Endpoint
router.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && user.passwordHash === password) {
        return res.json({
          success: true,
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            hourlyRate: user.hourlyRate,
            businessName: user.businessName,
            status: user.status
          }
        });
      }
    }

    // Default fallback demo users
    if (email.toLowerCase() === 'admin@freelanceflow.dev' && password === 'Admin@123') {
      return res.json({
        success: true,
        user: {
          id: 'admin-1',
          name: 'System Admin',
          email: 'admin@freelanceflow.dev',
          role: 'Admin',
          hourlyRate: 150,
          businessName: 'FreelanceFlow HQ',
          status: 'Active'
        }
      });
    }

    if (email.toLowerCase() === 'freelancer@freelanceflow.dev' && password === 'Freelancer@123') {
      return res.json({
        success: true,
        user: {
          id: 'free-1',
          name: 'Alex Morgan',
          email: 'freelancer@freelanceflow.dev',
          role: 'Freelancer',
          hourlyRate: 95,
          businessName: 'Morgan Studio & Dev',
          status: 'Active'
        }
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email and password.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Creates Freelancer Account Endpoint (Dispatches Nodemailer Email)
router.post('/auth/create-freelancer', async (req: Request, res: Response) => {
  const { name, email, password, role = 'Freelancer', hourlyRate = 95, businessName = 'Studio' } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, Email, and Password are required' });
  }

  try {
    // Send email using Nodemailer
    const emailResult = await sendFreelancerCredentialsEmail(email.toLowerCase(), name, password);

    if (mongoose.connection.readyState === 1) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const newUser = new User({
        name,
        email: email.toLowerCase(),
        passwordHash: password,
        role,
        hourlyRate,
        businessName,
        status: 'Active',
        emailSentStatus: emailResult.message
      });

      const saved = await newUser.save();
      return res.status(201).json({
        success: true,
        message: emailResult.message,
        user: saved
      });
    }

    // Local Persistence mode fallback
    return res.status(201).json({
      success: true,
      message: emailResult.message,
      user: {
        id: `u-${Date.now()}`,
        name,
        email,
        role,
        hourlyRate,
        businessName,
        status: 'Active',
        emailSentStatus: emailResult.message
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Freelancer Submits Password Reset Request to Admin
router.post('/auth/request-reset', async (req: Request, res: Response) => {
  const { userEmail, userName, requestedPassword, note } = req.body;
  if (!userEmail || !requestedPassword) {
    return res.status(400).json({ success: false, message: 'Email and Requested New Password are required' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const newReq = new PasswordResetRequest({
        userEmail: userEmail.toLowerCase(),
        userName: userName || userEmail,
        requestedPassword,
        note: note || '',
        status: 'Pending'
      });
      await newReq.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Your password reset request has been sent to the Admin for approval.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Approves / Rejects Reset Request Endpoint (Dispatches Nodemailer Notification)
router.post('/auth/approve-reset-request', async (req: Request, res: Response) => {
  const { requestId, userEmail, requestedPassword, action } = req.body;
  
  try {
    if (action === 'approve') {
      if (mongoose.connection.readyState === 1) {
        await User.findOneAndUpdate(
          { email: userEmail.toLowerCase() },
          { passwordHash: requestedPassword }
        );
        await PasswordResetRequest.findByIdAndUpdate(requestId, { status: 'Approved' });
      }

      // Dispatch reset confirmation email via Nodemailer
      const emailRes = await sendPasswordResetApprovalEmail(userEmail.toLowerCase(), userEmail, requestedPassword);

      return res.json({
        success: true,
        message: `Approved! Password updated for ${userEmail}. ${emailRes.message}`
      });
    } else {
      if (mongoose.connection.readyState === 1) {
        await PasswordResetRequest.findByIdAndUpdate(requestId, { status: 'Rejected' });
      }
      return res.json({ success: true, message: `Reset request rejected for ${userEmail}.` });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Gemini AI Copilot Endpoint (using gemini-3.6-flash)
router.post('/ai/generate', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are FlowAI, an elite AI assistant for freelancers, designers, and software agencies. Produce clear, professional, structured Markdown responses (proposals, client email drafts, project timeline estimates, meeting summaries, pricing advice).\n\nUser Request: ${prompt}`
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts) {
        const textParts = data.candidates[0].content.parts.map((p: any) => p.text).filter(Boolean).join('\n');
        if (textParts) {
          return res.json({
            success: true,
            output: textParts,
            source: 'gemini'
          });
        }
      }
      
      if (data.error) {
        console.warn('Gemini API Error:', data.error);
        return res.status(400).json({
          success: false,
          message: data.error.message || 'Gemini API Error'
        });
      }
    } catch (err: any) {
      console.warn('Gemini API Fetch Note:', err.message);
    }
  }

  return res.json({
    success: true,
    source: 'fallback',
    output: `### FlowAI Assistant\n\nPrompt: "${prompt}"\n\nPlease add a valid GEMINI_API_KEY in your .env file to enable live Gemini AI generation.`
  });
});

// CLIENTS ENDPOINTS
router.get('/clients', async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const clients = await Client.find().sort({ createdAt: -1 });
      return res.json({ success: true, source: 'mongodb', data: clients });
    }
    return res.json({ success: true, source: 'cache', message: 'Using local persistence engine' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/clients', async (req: Request, res: Response) => {
  const { name, phone, status } = req.body;
  if (!name || !phone || !status) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: Name, Phone, and Status are mandatory fields.'
    });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const newClient = new Client(req.body);
      const saved = await newClient.save();
      return res.status(201).json({ success: true, data: saved });
    }
    return res.status(200).json({ success: true, source: 'local', data: req.body });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PROJECTS ENDPOINTS
router.get('/projects', async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const projects = await Project.find().sort({ createdAt: -1 });
      return res.json({ success: true, source: 'mongodb', data: projects });
    }
    return res.json({ success: true, source: 'cache', message: 'Using local persistence engine' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
