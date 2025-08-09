import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ valid: false });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    return res.status(200).json({ valid: true, payload });
  } catch {
    return res.status(401).json({ valid: false });
  }
}
