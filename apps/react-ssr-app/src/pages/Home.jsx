import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const delay = (t = 500) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), t);
  });

const api = {
  getUser: async () => {
    await delay();
    return {
      name: 'mm',
    };
  },
};

export default function Home() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    let canceled = false;
    api.getUser().then((user) => {
      if (canceled) {
        return;
      }
      setUser(user);
    });
    return () => {
      canceled = true;
    };
  }, []);

  return (
    <>
      <h1>Home</h1>
      <p>user: {user?.name}</p>
      <Link to="/about">About</Link>
    </>
  );
}
