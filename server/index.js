import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import { supabase } from './supabaseClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Endpoint Test
app.get('/', (req, res) => {
  res.send('URL Shortener API Server is Running!');
});

// 2. Endpoint Memperpendek URL (POST /api/shorten)
app.post('/api/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    // Generate short code unik sepanjang 6 karakter
    const shortCode = nanoid(6);

    // Simpan ke Supabase
    const { data, error } = await supabase
      .from('urls')
      .insert([{ original_url: originalUrl, short_code: shortCode }])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: 'URL shortened successfully',
      data: {
        id: data.id,
        originalUrl: data.original_url,
        shortCode: data.short_code,
        shortUrl: `http://localhost:${PORT}/${data.short_code}`
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. Endpoint Redirect URL & Catat Analytics (GET /:shortCode)
app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Cari URL asli berdasarkan short_code
    const { data: urlData, error: urlError } = await supabase
      .from('urls')
      .select('*')
      .eq('short_code', shortCode)
      .single();

    if (urlError || !urlData) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Catat klik ke tabel analytics
    await supabase.from('analytics').insert([
      {
        url_id: urlData.id,
        user_agent: req.headers['user-agent'] || 'Unknown'
      }
    ]);

    // Redirect user ke URL Asli
    return res.redirect(urlData.original_url);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});