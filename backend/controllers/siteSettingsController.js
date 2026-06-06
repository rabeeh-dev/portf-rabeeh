const SiteSettings = require('../models/SiteSettings');

const getSettingsDoc = async () => {
  let doc = await SiteSettings.findOne();
  if (!doc) {
    doc = await SiteSettings.create({});
  }
  return doc;
};

const getSettings = async (req, res) => {
  try {
    const settings = await getSettingsDoc();
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const doc = await getSettingsDoc();
    const {
      bookCallUrl,
      bookCallLabel,
      heroHeading,
      heroSub,
      aboutHeading,
      aboutHeadingAccent,
      aboutBio,
      aboutTags,
      aboutImage,
      instagramUrl,
      linkedinUrl,
    } = req.body;

    if (bookCallUrl !== undefined) doc.bookCallUrl = bookCallUrl.trim();
    if (bookCallLabel !== undefined) doc.bookCallLabel = bookCallLabel.trim();
    if (heroHeading !== undefined) doc.heroHeading = heroHeading.trim();
    if (heroSub !== undefined) doc.heroSub = heroSub.trim();
    if (aboutHeading !== undefined) doc.aboutHeading = aboutHeading.trim();
    if (aboutHeadingAccent !== undefined) doc.aboutHeadingAccent = aboutHeadingAccent.trim();
    if (aboutBio !== undefined) doc.aboutBio = aboutBio.trim();
    if (aboutImage !== undefined) doc.aboutImage = String(aboutImage).trim();
    if (instagramUrl !== undefined) doc.instagramUrl = instagramUrl.trim();
    if (linkedinUrl !== undefined) doc.linkedinUrl = linkedinUrl.trim();
    if (aboutTags !== undefined) {
      doc.aboutTags = Array.isArray(aboutTags)
        ? aboutTags.map((t) => String(t).trim()).filter(Boolean)
        : String(aboutTags)
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
    }

    await doc.save();

    res.json(doc);
  } catch (error) {
    console.error('Update settings error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSettings };
