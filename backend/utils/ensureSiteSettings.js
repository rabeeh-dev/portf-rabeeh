const SiteSettings = require('../models/SiteSettings');

async function ensureSiteSettings() {
  const existing = await SiteSettings.findOne();
  if (existing) {
    return existing;
  }
  const created = await SiteSettings.create({});
  console.log('⚙️  Site settings initialized with defaults');
  return created;
}

module.exports = ensureSiteSettings;
