document.getElementById('qrForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const name = form.name.value;
  const target_url = form.target_url.value;
  const dpi = form.dpi.value;

  // Build QR code preview URL
  const qrUrl = `/api/qr?code=${encodeURIComponent(target_url)}&dpi=${dpi}&bgcolor=ffffff`;

  // Show the QR code preview
  const qrImage = document.getElementById('qrImage');
  const qrPreview = document.getElementById('qrPreview');
  const saveButton = document.getElementById('saveButton');

  qrImage.src = qrUrl;
  saveButton.href = qrUrl;
  qrPreview.style.display = 'block';

  // Save to Supabase
  const { createClient } = supabase;
  const supabaseUrl = 'https://jdtkyapuzowluikcwixg.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkdGt5YXB1em93bHVpa2N3aXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTkxMzMsImV4cCI6MjA2NjU3NTEzM30.ZCb4XlRZvVUv2VbtOB-xDFk3gTSFGaQLAMCt5VVs1JA'; // Replace with real one
  const db = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await db
    .from('qr_codes')
    .insert([{ name, target_url, dpi, image_format: 'png' }]);

  if (error) {
    console.error('Error saving to Supabase:', error.message);
  }
});
