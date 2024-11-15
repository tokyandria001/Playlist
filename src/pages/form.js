import { useState } from 'react';
import styles from '../styles/Form.module.css';

export default function SongSearchForm() {
  const [artistName, setArtistName] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'artistName') setArtistName(value);
    else if (name === 'songTitle') setSongTitle(value);
    else if (name === 'albumName') setAlbumName(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`/api/songs?artist=${encodeURIComponent(artistName)}&title=${encodeURIComponent(songTitle)}&album=${encodeURIComponent(albumName)}`, {
        method: 'GET',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Une erreur est survenue');
      }

      const data = await res.json();
      setSongs(data.songs);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="artistName" className={styles.label}>Nom de l'artiste:</label>
        <input
          type="text"
          id="artistName"
          name="artistName"
          value={artistName}
          onChange={handleChange}
          className={styles.input}
          placeholder="Nom de l'artiste"
        />

        <label htmlFor="songTitle" className={styles.label}>Titre de la chanson:</label>
        <input
          type="text"
          id="songTitle"
          name="songTitle"
          value={songTitle}
          onChange={handleChange}
          className={styles.input}
          placeholder='Titre de la chanson'
        />

        <label htmlFor="albumName" className={styles.label}>Nom de l'album:</label>
        <input
          type="text"
          id="albumName"
          name="albumName"
          value={albumName}
          onChange={handleChange}
          className={styles.input}
          placeholder="Nom de l'album"
        />

        <button type="submit" className={styles.button}>Rechercher</button>
        {error && <p className={styles.error}>Erreur: {error}</p>}
      </form>
      
      {songs.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Artiste</th>
              <th>Titre</th>
              <th>Album</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song.id}>
                <td>{song.artist}</td>
                <td>{song.title}</td>
                <td>{song.album}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
