import { streamingServiceUrl } from './config';

const fetcher = (...args) => fetch(...args)
  .then(r => {
    if (!r.ok) {
      throw new Error(`Server responded with ${r.statusText}`);
    }
    return r.json();
  })

export const getAllVideos = () => fetcher(`${streamingServiceUrl}/videos`);