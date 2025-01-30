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
  pixel_art_image_path: string;
};

const DashboardPage = () => {
  const isAuthenticated = useAuth();
  const [collectedRewards, setCollectedRewards] = useState<MoviePoster[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    axiosInstance.get("/collected-rewards/")
      .then((res) => {
        // `id` をキーにして重複を排除
        const uniqueRewards = Array.from(
          new Map(res.data.map((poster: MoviePoster) => [poster.id, poster])).values()
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
        <div>マイコレクション</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {collectedRewards.length > 0 ? (
            collectedRewards.map((poster) => (
              <div key={poster.id} style={{ width: "100px", textAlign: "center" }}>
                <img 
                  src={`/assets/${poster.image_url}`} 
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
