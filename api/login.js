import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { password } = req.body || {};
  if (!password || password !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ role: 'user' }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '12h' });
  return res.status(200).json({ token });
}
