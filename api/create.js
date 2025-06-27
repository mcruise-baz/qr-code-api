import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jdtkyapuzowluikcwixg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkdGt5YXB1em93bHVpa2N3aXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTkxMzMsImV4cCI6MjA2NjU3NTEzM30.ZCb4XlRZvVUv2VbtOB-xDFk3gTSFGaQLAMCt5VVs1JA';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, target_url, dpi } = req.body;

  if (!name || !target_url || !dpi) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const { data, error } = await supabase
    .from('qr_codes') // Your actual table name
    .insert([{ name, target_url, dpi }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ success: true, data });
}
