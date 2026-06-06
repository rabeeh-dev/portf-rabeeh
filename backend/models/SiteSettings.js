const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    bookCallUrl: {
      type: String,
      default: '',
      trim: true,
    },
    bookCallLabel: {
      type: String,
      default: '',
      trim: true,
    },
    heroHeading: {
      type: String,
      default: '',
      trim: true,
    },
    heroSub: {
      type: String,
      default: '',
    },
    aboutHeading: {
      type: String,
      default: '',
      trim: true,
    },
    aboutHeadingAccent: {
      type: String,
      default: '',
      trim: true,
    },
    aboutBio: {
      type: String,
      default: '',
    },
    aboutTags: {
      type: [String],
      default: [],
    },
    aboutImage: {
      type: String,
      default: '',
      trim: true,
    },
    instagramUrl: {
      type: String,
      default: '',
      trim: true,
    },
    linkedinUrl: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
