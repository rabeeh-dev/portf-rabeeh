/**
 * Plain-text password helpers (no hashing).
 * ADMIN_PASSWORD in .env and login form values must match exactly.
 */

function verifyPassword(plainPassword, storedPassword) {
  const input = String(plainPassword ?? '');
  const stored = String(storedPassword ?? '');
  if (!input || !stored) {
    return false;
  }
  return input === stored;
}

module.exports = {
  verifyPassword,
};
