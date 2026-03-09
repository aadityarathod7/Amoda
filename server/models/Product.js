import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    scentCategory: {
      type: String,
      enum: ['floral', 'woody', 'fruity', 'fresh', 'sweet', 'custom'],
      default: 'custom',
    },
    burnTime: {
      type: String,
      required: true,
    },
    waxType: {
      type: String,
      enum: ['soy', 'beeswax', 'coconut', 'paraffin', 'blend'],
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Product', productSchema);
