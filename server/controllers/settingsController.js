import SiteSettings from '../models/SiteSettings.js';

const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  return settings;
};

// GET /api/settings/public
export const getPublicSettings = async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json({
    whatsappNumber: settings.whatsappNumber,
    instagramUsername: settings.instagramUsername,
    heroTagline: settings.heroTagline,
    maintenanceMode: settings.maintenanceMode,
  });
};

// PUT /api/admin/settings
export const updateSettings = async (req, res) => {
  const settings = await getOrCreateSettings();
  const { whatsappNumber, instagramUsername, heroTagline, maintenanceMode } = req.body;

  if (whatsappNumber !== undefined) settings.whatsappNumber = whatsappNumber;
  if (instagramUsername !== undefined) settings.instagramUsername = instagramUsername;
  if (heroTagline !== undefined) settings.heroTagline = heroTagline;
  if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;

  await settings.save();
  res.json(settings);
};
