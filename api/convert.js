import jwt from 'jsonwebtoken';
import { parseChart } from './svc/parser.js';
import { generateTable } from './svc/formatter.js';
import { generatePrompt } from './svc/prompt-generator.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  try {
    jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { rawText } = req.body || {};
  if (!rawText) return res.status(400).json({ error: 'rawText required' });

  try {
    const data = parseChart(rawText);
    const tableHtml = generateTable(data);
    const prompt = generatePrompt(data);
    return res.status(200).json({ data, tableHtml, prompt });
  } catch (e) {
    return res.status(500).json({ error: 'convert_failed', message: e?.message });
  }
}
