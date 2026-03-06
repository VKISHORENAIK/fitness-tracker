// For demo/single-user: use USER_ID from env. In production, replace with JWT auth.
export function getUserId(req) {
  const id = req.headers['x-user-id'] || process.env.USER_ID;
  if (!id) throw new Error('User not identified. Set USER_ID in .env or send X-User-Id header.');
  return id;
}
