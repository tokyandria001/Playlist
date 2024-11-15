// pages/api/songs.js
import { dbConnect } from '../../../lib/dbConnect';

export default async function handler(req, res) {
  const { artist, title, album } = req.query;

  try {
    const connection = await dbConnect();

    // Construire la requête SQL
    let query = 'SELECT * FROM songs WHERE 1=1';
    const params = [];

    if (artist) {
      query += ' AND LOWER(artist) LIKE LOWER(?)';
      params.push(`%${artist}%`);
    }

    if (title) {
      query += ' AND LOWER(title) LIKE LOWER(?)';
      params.push(`%${title}%`);
    }

    if (album) {
      query += ' AND LOWER(album) LIKE LOWER(?)';
      params.push(`%${album}%`);
    }

    const [rows] = await connection.execute(query, params);
    res.status(200).json({ songs: rows });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
}
