import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    whatsappNumber: { type: String, default: '' },
    instagramUsername: { type: String, default: '' },
    heroTagline: { type: String, default: 'Handcrafted with love, scented with soul' },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
