import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST supported');
  }

  const { target_url, dpi = 72, image_format = 'png', slug } = req.body;

  if (!target_url) {
    return res.status(400).json({ error: 'target_url is required' });
  }

  // Save to Supabase
  const { data, error } = await supabase
    .from('qr_codes')
    .insert([{ target_url, dpi, image_format, slug, is_active: true }])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Generate QR code
  try {
    const qr = await QRCode.toDataURL(target_url, {
      width: dpi === 300 ? 1000 : 300, // 300dpi = ~1000px, 72dpi = ~300px
    });

    const img = Buffer.from(qr.split(',')[1], 'base64');

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `inline; filename="${slug || 'qr'}.png"`);
    return res.send(img);
  } catch (err) {
    return res.status(500).json({ error: 'QR generation failed' });
  }
}
