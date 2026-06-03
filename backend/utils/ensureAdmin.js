const User = require('../models/User');

/**
 * Sync the single admin account from ADMIN_EMAIL / ADMIN_PASSWORD in .env.
 * Passwords are stored and compared as plain text (no hashing).
 */
async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD ?? '');
  const name = (process.env.ADMIN_NAME || 'Admin').trim();

  if (!email || !password) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD must be set in backend/.env'
    );
  }

  const removed = await User.deleteMany({ email: { $ne: email } });
  if (removed.deletedCount > 0) {
    console.log(`👤 Removed ${removed.deletedCount} outdated admin account(s)`);
  }

  const user = await User.findOne({ email });
  if (user) {
    user.name = name;
    user.password = password;
    await user.save();
    console.log(`👤 Admin ready: ${email}`);
    return user;
  }

  const created = await User.create({
    name,
    email,
    password,
  });
  console.log(`👤 Admin created: ${email}`);
  return created;
}

module.exports = ensureAdminUser;
