// app/feed/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

// Define the Feed type
type Feed = {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  imageUrl: string;
};

const FeedDetails = () => {
  const params = useParams();
  const id = params?.id as string;
  const [feedDetail, setFeedDetail] = useState<Feed | null>(null);

  useEffect(() => {
    if (!id) return;

    const storedData = localStorage.getItem('myData');
    if (storedData) {
      try {
        const Feeds: Feed[] = JSON.parse(storedData);
        const selectedFeed = Feeds.find(feed => feed.id === parseInt(id));
        if (selectedFeed) {
          setFeedDetail(selectedFeed);
        }
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }
  }, [id]);

  if (!feedDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container bg-light" style={{ marginTop: '5rem' }}>
      <div className="card mt-5">
        <img
          src={feedDetail.imageUrl}
          style={{ maxWidth: '100%', maxHeight: '300px' }}
          className="card-img-top"
          alt="Blog"
        />
        <div className="card-body">
          <h1 className="card-title">{feedDetail.title}</h1>
          <p className="card-text">{feedDetail.description}</p>
          <p className="card-text">Author: {feedDetail.author}</p>
          <p className="card-text">Date: {feedDetail.date}</p>
        </div>
      </div>
    </div>
  );
};

export default FeedDetails;