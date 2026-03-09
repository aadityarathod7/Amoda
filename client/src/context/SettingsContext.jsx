import { createContext, useContext, useEffect, useState } from 'react';
import { fetchPublicSettings } from '../utils/api';

const SettingsContext = createContext({});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    whatsappNumber: '',
    instagramUsername: '',
    heroTagline: 'Handcrafted with love, scented with soul',
    maintenanceMode: false,
  });

  useEffect(() => {
    fetchPublicSettings()
      .then((res) => setSettings(res.data))
      .catch(() => {});
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);
