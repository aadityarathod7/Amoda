import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import SiteSettings from '../models/SiteSettings.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Rose Petal Bliss',
    description:
      'A romantic floral bouquet of fresh rose petals kissed with hints of peony and soft musk. Perfect for creating an intimate, dreamy atmosphere in your bedroom or living room.',
    price: 699,
    scentCategory: 'floral',
    burnTime: '45-50 hours',
    waxType: 'soy',
    weight: '200g',
    stockQuantity: 25,
    images: [
      '/src/public/candles/Gemini_Generated_Image_yqpk4pyqpk4pyqpk.png',
      '/src/public/candles/Gemini_Generated_Image_c0jdvoc0jdvoc0jd.png',
    ],
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Sandalwood Serenity',
    description:
      'Rich, warm sandalwood blended with cedarwood and a touch of vanilla. A grounding, meditative scent that transforms any space into a sanctuary. Ideal for yoga, meditation, or unwinding after a long day.',
    price: 849,
    scentCategory: 'woody',
    burnTime: '50-55 hours',
    waxType: 'blend',
    weight: '250g',
    stockQuantity: 18,
    images: [
      '/src/public/candles/Gemini_Generated_Image_yz866wyz866wyz86.png',
      '/src/public/candles/Gemini_Generated_Image_38bu1538bu1538bu.png',
    ],
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Citrus Sunrise',
    description:
      'An energising burst of sun-ripened orange, lemon zest, and grapefruit. Bright, clean, and uplifting — the perfect morning companion to kickstart your day with positivity.',
    price: 599,
    scentCategory: 'fruity',
    burnTime: '40-45 hours',
    waxType: 'coconut',
    weight: '180g',
    stockQuantity: 30,
    images: [
      '/src/public/candles/Gemini_Generated_Image_yqpk4pyqpk4pyqpk.png',
      '/src/public/candles/Gemini_Generated_Image_yz866wyz866wyz86.png',
    ],
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Ocean Mist',
    description:
      'Crisp sea air, driftwood, and a whisper of eucalyptus. Close your eyes and let the waves wash over you. A refreshing escape to the coast, bottled in wax.',
    price: 749,
    scentCategory: 'fresh',
    burnTime: '45-50 hours',
    waxType: 'soy',
    weight: '220g',
    stockQuantity: 12,
    images: [
      '/src/public/candles/Gemini_Generated_Image_c0jdvoc0jdvoc0jd.png',
      '/src/public/candles/Gemini_Generated_Image_38bu1538bu1538bu.png',
    ],
    isFeatured: false,
    isActive: true,
  },
  {
    name: 'Vanilla Dream',
    description:
      'Indulgent warm vanilla bean swirled with caramel and a hint of toasted almond. Like dessert in a jar — sweet, comforting, and utterly irresistible.',
    price: 649,
    scentCategory: 'sweet',
    burnTime: '48-52 hours',
    waxType: 'soy',
    weight: '200g',
    stockQuantity: 20,
    images: [
      '/src/public/candles/Gemini_Generated_Image_yqpk4pyqpk4pyqpk.png',
      '/src/public/candles/Gemini_Generated_Image_c0jdvoc0jdvoc0jd.png',
    ],
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Lavender Twilight',
    description:
      'Calming Provençal lavender with chamomile and soft white tea. Wind down, breathe deep, and drift into rest. The perfect bedtime ritual in a candle.',
    price: 799,
    scentCategory: 'floral',
    burnTime: '50-55 hours',
    waxType: 'beeswax',
    weight: '240g',
    stockQuantity: 0,
    images: [
      '/src/public/candles/Gemini_Generated_Image_yz866wyz866wyz86.png',
      '/src/public/candles/Gemini_Generated_Image_38bu1538bu1538bu.png',
    ],
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Amber & Oud',
    description:
      'A deep, luxurious blend of amber resin and smoky oud wood. Mysterious and opulent — for those who want their space to feel like a 5-star retreat.',
    price: 999,
    scentCategory: 'woody',
    burnTime: '55-60 hours',
    waxType: 'blend',
    weight: '280g',
    stockQuantity: 8,
    images: [
      '/src/public/candles/Gemini_Generated_Image_c0jdvoc0jdvoc0jd.png',
      '/src/public/candles/Gemini_Generated_Image_yqpk4pyqpk4pyqpk.png',
    ],
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Mint & Eucalyptus',
    description:
      'A revitalising blend of cool peppermint and forest eucalyptus. Clean, crisp, and invigorating — transforms any room into a spa-like haven.',
    price: 649,
    scentCategory: 'fresh',
    burnTime: '42-48 hours',
    waxType: 'soy',
    weight: '190g',
    stockQuantity: 22,
    images: [
      '/src/public/candles/Gemini_Generated_Image_38bu1538bu1538bu.png',
      '/src/public/candles/Gemini_Generated_Image_yz866wyz866wyz86.png',
    ],
    isFeatured: false,
    isActive: true,
  },
  {
    name: 'Peach Blossom',
    description:
      'Sun-warmed peaches with delicate white jasmine and a creamy base note. Light, feminine, and joyful — like a summer afternoon in the garden.',
    price: 679,
    scentCategory: 'fruity',
    burnTime: '40-45 hours',
    waxType: 'coconut',
    weight: '185g',
    stockQuantity: 15,
    images: [
      '/src/public/candles/Gemini_Generated_Image_yqpk4pyqpk4pyqpk.png',
      '/src/public/candles/Gemini_Generated_Image_38bu1538bu1538bu.png',
    ],
    isFeatured: false,
    isActive: true,
  },
  {
    name: 'Cinnamon & Clove',
    description:
      'Warm, spiced cinnamon bark and clove buds with a hint of orange peel. Cosy, festive, and deeply comforting — the scent of home.',
    price: 729,
    scentCategory: 'sweet',
    burnTime: '46-50 hours',
    waxType: 'soy',
    weight: '210g',
    stockQuantity: 4,
    images: [
      '/src/public/candles/Gemini_Generated_Image_c0jdvoc0jdvoc0jd.png',
      '/src/public/candles/Gemini_Generated_Image_yz866wyz866wyz86.png',
    ],
    isFeatured: false,
    isActive: true,
  },
  {
    name: 'Jasmine Nights',
    description:
      'Heady night-blooming jasmine wrapped in warm amber and a touch of sandalwood. Sensual, floral, and captivating — made for candlelit evenings.',
    price: 879,
    scentCategory: 'floral',
    burnTime: '50-55 hours',
    waxType: 'beeswax',
    weight: '250g',
    stockQuantity: 10,
    images: [
      '/src/public/candles/Gemini_Generated_Image_38bu1538bu1538bu.png',
      '/src/public/candles/Gemini_Generated_Image_yqpk4pyqpk4pyqpk.png',
    ],
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Cedar & Pine',
    description:
      'A walk through a misty pine forest — fresh cedar, crisp pine needles, and a hint of cool earth. Grounding and deeply atmospheric.',
    price: 779,
    scentCategory: 'woody',
    burnTime: '48-54 hours',
    waxType: 'soy',
    weight: '230g',
    stockQuantity: 0,
    images: [
      '/src/public/candles/Gemini_Generated_Image_yz866wyz866wyz86.png',
      '/src/public/candles/Gemini_Generated_Image_c0jdvoc0jdvoc0jd.png',
    ],
    isFeatured: false,
    isActive: true,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Seed admin
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });
      console.log(`Admin created: ${process.env.ADMIN_EMAIL}`);
    } else {
      console.log('Admin already exists, skipping.');
    }

    // Seed settings
    const existingSettings = await SiteSettings.findOne();
    if (!existingSettings) {
      await SiteSettings.create({
        whatsappNumber: process.env.WHATSAPP_NUMBER || '919009303952',
        instagramUsername: process.env.INSTAGRAM_USERNAME || 'amoda_candle',
        heroTagline: 'Handcrafted with love, scented with soul',
        maintenanceMode: false,
      });
      console.log('Site settings seeded.');
    }

    // Seed products — wipe and re-seed so we always get fresh data
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} sample products seeded.`);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
