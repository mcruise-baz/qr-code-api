import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, target_url, dpi = 72, image_format = 'png' } = req.body;

  if (!name || !target_url) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const slug = name.toLowerCase().replace(/\s+/g, '-'); // e.g. "My QR" → "my-qr"

  const { data, error } = await supabase.from('qr_codes').insert([
    {
      name,
      target_url,
      dpi,
      image_format,
      slug,
    }
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true, data });
}
