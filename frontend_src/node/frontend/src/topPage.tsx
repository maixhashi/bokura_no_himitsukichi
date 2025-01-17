import React, { useEffect, useState } from 'react';
import axios from 'axios';

type PageData = {
  message: string;
};

const TopPage: React.FC = () => {
  const [data, setData] = useState<PageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get<PageData>('http://localhost:8000/api/pages/', {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //       setData(response.data);
  //     } catch (error: any) {
  //       setError(error.response?.data?.message || error.message || 'Unknown error occurred');
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <div>
      <h1>React with Django</h1>
      <h1>I am topPage</h1>
      {/* {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data ? <p>{data.message}</p> : <p>Loading...</p>} */}
    </div>
  );
};

export default TopPage;
    