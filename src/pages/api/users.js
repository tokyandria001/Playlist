import { dbConnect } from '../../../lib/dbConnect';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  const { method } = req;
  console.log('Request method:', method);

  try {
    const connection = await dbConnect();

    switch (method) {
      case 'GET':
        try {
          const [rows] = await connection.execute('SELECT * FROM utilisateurs');
          res.status(200).json({ success: true, data: rows });
        } catch (err) {
          console.error('GET error:', err);
          res.status(400).json({ success: false, error: err.message });
        } finally {
          await connection.end();
        }
        break;

      case 'POST':
        try {
          const { lastName, firstName, pseudo, email, password } = req.body;

          if (!lastName || !firstName || !email || !password) {
            throw new Error('Last name, first name, email, and password are required');
          }

          // Hacher le mot de passe
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          // Exécuter la requête SQL pour insérer les données
          const [result] = await connection.execute(
            'INSERT INTO utilisateurs (lastName, firstName, pseudo, email, password) VALUES (?, ?, ?, ?, ?)',
            [lastName, firstName, pseudo, email, hashedPassword]
          );

          // Réponse en cas de succès
          res.status(201).json({ success: true, data: { id: result.insertId, lastName, firstName, pseudo, email } });
        } catch (err) {
          console.error('POST error:', err);
          res.status(400).json({ success: false, error: err.message });
        } finally {
          await connection.end();
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ success: false, error: 'Database connection failed' });
  }
}
