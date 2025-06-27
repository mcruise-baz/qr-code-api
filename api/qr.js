import { createClient } from '@supabase/supabase-js'
import QRCode from 'qrcode' // Assuming you’re using this lib

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  const code = req.query.code || 'no-code'
  const dpi = req.query.dpi === '300' ? 300 : 72

  // 🧠 1. Log to Supabase
  await supabase.from('qr_codes').insert([{ code, dpi }])

  // 🎨 2. Generate QR Code PNG Buffer
  try {
    const qrImage = await QRCode.toBuffer(code, {
      width: dpi === 300 ? 1000 : 300,
      margin: 1,
      color: {
        dark: '#000',
        light: '#0000' // Transparent
      }
    })

    // 📨 3. Send response
    res.setHeader('Content-Type', 'image/png')
    res.status(200).send(qrImage)
  } catch (error) {
    console.error('QR Code Generation Error:', error)
    res.status(500).json({ error: 'Failed to generate QR code' })
  }
}
