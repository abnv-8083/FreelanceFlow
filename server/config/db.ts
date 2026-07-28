import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Configure DNS servers to reliably resolve MongoDB SRV records on Windows networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Fallback to default OS DNS if setServers is restricted
}

const DEFAULT_MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://demo:freelanceflow@cluster0.mongodb.net/freelanceflow?retryWrites=true&w=majority';

/**
 * Automatically sanitizes MongoDB URIs by URL-encoding special characters in passwords (e.g. '@' -> '%40')
 */
export const sanitizeMongoUri = (uri: string): string => {
  if (!uri || !uri.startsWith('mongodb')) return uri;
  try {
    const protocolMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/);
    if (!protocolMatch) return uri;

    const protocol = protocolMatch[1];
    const rest = protocolMatch[2];

    const lastAtPos = rest.lastIndexOf('@');
    if (lastAtPos === -1) return uri;

    const creds = rest.substring(0, lastAtPos);
    const hostAndPath = rest.substring(lastAtPos + 1);

    const firstColonPos = creds.indexOf(':');
    if (firstColonPos === -1) return uri;

    const user = creds.substring(0, firstColonPos);
    const pass = creds.substring(firstColonPos + 1);

    const decodedPass = decodeURIComponent(pass);
    const encodedPass = encodeURIComponent(decodedPass);

    return `${protocol}${user}:${encodedPass}@${hostAndPath}`;
  } catch {
    return uri;
  }
};

export const connectDB = async (customUri?: string) => {
  const rawUri = customUri || process.env.MONGO_URI || DEFAULT_MONGO_URI;
  const mongoUri = sanitizeMongoUri(rawUri);

  try {
    if (mongoose.connection.readyState >= 1) {
      await mongoose.disconnect();
    }
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ Connected to MongoDB Atlas DB successfully: ${mongoose.connection.host}`);
    return { success: true, host: mongoose.connection.host };
  } catch (error: any) {
    console.warn(`⚠️ MongoDB Atlas Connection Note: ${error?.message || error}.`);
    return { success: false, error: error?.message || 'Connection failed' };
  }
};
