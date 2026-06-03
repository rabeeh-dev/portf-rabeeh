const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    bookCallUrl: {
      type: String,
      default: '#contact',
      trim: true,
    },
    bookCallLabel: {
      type: String,
      default: 'Book a Free Call',
      trim: true,
    },
    heroHeading: {
      type: String,
      default: 'Your story, positioned to attract real opportunities.',
      trim: true,
    },
    heroSub: {
      type: String,
      default:
        'We help founders craft their category, tell impactful stories, and build digital experiences that drive growth.',
    },
    aboutHeading: {
      type: String,
      default: 'Pioneering the',
      trim: true,
    },
    aboutHeadingAccent: {
      type: String,
      default: 'New Frontier',
      trim: true,
    },
    aboutBio: {
      type: String,
      default:
        'Founded by a collective of designers and engineers, rabeeh exists to bridge the gap between imagination and implementation. We believe technology should be as beautiful as it is functional.',
    },
    aboutTags: {
      type: [String],
      default: ['UI/UX DESIGN', 'BRANDING', 'WEBFLOW', 'NEXT.JS', 'TAILWIND CSS', 'FIGMA'],
    },
    aboutImage: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
