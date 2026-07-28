import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Creates and returns a Nodemailer Transporter instance
 */
const getTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailService = process.env.EMAIL_SERVICE || 'gmail';

  if (!emailUser || !emailPass) {
    return null;
  }

  return nodemailer.createTransport({
    service: emailService,
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
};

/**
 * Dispatches account login credentials email to a newly created Freelancer
 */
export const sendFreelancerCredentialsEmail = async (
  toEmail: string,
  freelancerName: string,
  temporaryPassword: string
): Promise<{ success: boolean; message: string }> => {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`ℹ️ Nodemailer: EMAIL_USER or EMAIL_PASS not set in .env. Simulated email sent to ${toEmail}.`);
    return {
      success: true,
      message: `Simulated email dispatched to ${toEmail} (Configure EMAIL_USER & EMAIL_PASS in .env to send real emails).`
    };
  }

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #ffffff; padding: 32px; border-radius: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #3b82f6; margin: 0; font-size: 28px; font-weight: 800;">Freelance<span style="color: #ffffff;">Flow</span></h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Freelancer Workspace Account Created</p>
      </div>

      <div style="background-color: #1e293b; padding: 24px; border-radius: 16px; border: 1px solid #334155;">
        <h2 style="color: #ffffff; margin-top: 0; font-size: 18px;">Welcome, ${freelancerName}! 👋</h2>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          Your freelancer workspace account has been created by the System Administrator. You can now log in to manage your client CRM, projects, invoices, and time tracking.
        </p>

        <div style="background-color: #0f172a; padding: 16px; border-radius: 12px; margin: 20px 0; border: 1px dashed #3b82f6;">
          <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">Your Credentials</div>
          <div style="font-size: 14px; color: #ffffff; margin-bottom: 4px;"><strong>Email:</strong> <span style="color: #60a5fa;">${toEmail}</span></div>
          <div style="font-size: 14px; color: #ffffff;"><strong>Temporary Password:</strong> <span style="font-family: monospace; font-weight: bold; color: #34d399;">${temporaryPassword}</span></div>
        </div>

        <div style="text-align: center; margin-top: 28px;">
          <a href="http://localhost:3000" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 28px; border-radius: 12px;">
            Log In to FreelanceFlow →
          </a>
        </div>
      </div>

      <div style="text-align: center; margin-top: 24px; color: #64748b; font-size: 12px;">
        FreelanceFlow CRM Platform • Automatic Dispatch
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"FreelanceFlow Admin" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `🔑 Your FreelanceFlow Account Credentials`,
      html: htmlContent
    });
    console.log(`✅ Nodemailer: Live email successfully sent to ${toEmail} (MessageId: ${info.messageId})`);
    return { success: true, message: `Live email sent to ${toEmail} (ID: ${info.messageId})` };
  } catch (error: any) {
    console.error(`❌ Nodemailer Error sending to ${toEmail}:`, error.message);
    return { success: false, message: `Email failed: ${error.message}` };
  }
};

/**
 * Dispatches password reset approval email to Freelancer
 */
export const sendPasswordResetApprovalEmail = async (
  toEmail: string,
  userName: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const transporter = getTransporter();

  if (!transporter) {
    return {
      success: true,
      message: `Simulated reset approval email sent to ${toEmail}.`
    };
  }

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #ffffff; padding: 32px; border-radius: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #10b981; margin: 0; font-size: 28px; font-weight: 800;">Password Reset Approved</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">FreelanceFlow Security Update</p>
      </div>

      <div style="background-color: #1e293b; padding: 24px; border-radius: 16px; border: 1px solid #334155;">
        <h2 style="color: #ffffff; margin-top: 0; font-size: 18px;">Hello, ${userName || 'Freelancer'}!</h2>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          Your password reset request has been approved by the System Administrator.
        </p>

        <div style="background-color: #0f172a; padding: 16px; border-radius: 12px; margin: 20px 0; border: 1px dashed #10b981;">
          <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">Your New Password</div>
          <div style="font-size: 16px; font-family: monospace; font-weight: bold; color: #34d399;">${newPassword}</div>
        </div>

        <div style="text-align: center; margin-top: 28px;">
          <a href="http://localhost:3000" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 28px; border-radius: 12px;">
            Log In Now →
          </a>
        </div>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"FreelanceFlow Admin" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `✅ Password Reset Approved - FreelanceFlow`,
      html: htmlContent
    });
    return { success: true, message: `Live reset email sent to ${toEmail}` };
  } catch (error: any) {
    return { success: false, message: `Email dispatch error: ${error.message}` };
  }
};
