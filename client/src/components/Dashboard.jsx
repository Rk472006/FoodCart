import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';

export default function Dashboard() {
  const { uid } = useParams(); 

  return (
    <>
      <Navbar uid={uid} />
      <div style={{ padding: '20px' }}>
        <h2>Welcome to your Dashboard, User ID: {uid}</h2>
      </div>
    </>
  );
}
