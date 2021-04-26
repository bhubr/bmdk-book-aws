import { useEffect, useState, useMemo } from 'react';
import { getAllVideos } from './api';
import { streamingServiceUrl } from './config';
import './App.css';

function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(null);
  const playingUrl = useMemo(() => playing && `${streamingServiceUrl}/videos/${playing._id}`, [playing]);

  useEffect(() => {
    setLoading(true);
    getAllVideos()
      .then(setVideos)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="App">
      <div>{loading && 'loading'}</div>
      <div>{error && error.message}</div>

      <h3>Videos</h3>
      {
        videos.map(v => (
          <div key={v._id}>
            {v.path}
            <button type="button" onClick={() => setPlaying(v)}>play</button>
          </div>
        ))
      }
      {
        playing && (
          <>
            <h3>Playing {playing.path}</h3>
            <video width="320" height="240" controls>
              <source src={playingUrl} type="video/mp4"></source>
            </video>
          </>
        )
      }
    </div>
  );
}

export default App;
