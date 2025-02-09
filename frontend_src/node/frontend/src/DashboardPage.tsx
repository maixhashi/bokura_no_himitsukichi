import { useEffect, useState } from "react";
import Layout from './Layout';
import { useAuth } from "./hooks/useAuth";
import axiosInstance from "./utils/axiosInstance";

import './Dashboard.css';

type MoviePoster = {
  id: number;
  title: string;
  image_url: string;
  tmdb_id: string;
  poster_url: string;
};

const DashboardPage = () => {
  const isAuthenticated = useAuth();
  const [collectedRewards, setCollectedRewards] = useState<MoviePoster[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    axiosInstance.get<MoviePoster[]>("/collected-rewards/")
  .then((res) => {
    const uniqueRewards = Array.from(
      new Map(res.data.map((poster) => [poster.id, poster])).values()
    );
    setCollectedRewards(uniqueRewards);
  })
  .catch((error) => {
    console.error("Error fetching rewards:", error);
  });


  }, [isAuthenticated]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="container-dashboard">
        <div className="dashboard-title pixel-font">
          <img
            src="/assets/icon_art/movie-cracker.png"
            alt="Movie Cracker"
            className="icon-movie-cracker"
            />
          あつめたムービー
          <img
            src="/assets/icon_art/movie-cracker.png"
            alt="Movie Cracker"
            className="icon-movie-cracker"
          />
        </div>
        <div className="container-of-collectionRewards">
          {collectedRewards.length > 0 ? (
            collectedRewards.map((poster) => (
              <div key={poster.id} style={{ width: "100px", textAlign: "center" }}>
                <img 
                  src={`${poster.poster_url}`} 
                  alt={poster.title} 
                  style={{ width: "100%", height: "auto" }} 
                />
                <p className="pixel-font">{poster.title}</p>
              </div>
            ))
          ) : (
            <p>まだ映画ポスターを獲得していません。</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
