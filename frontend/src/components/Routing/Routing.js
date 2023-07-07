import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Profile from '../Profile/Profile';
import Post from '../Post/Post';
import Discover from '../Discover/Discover';
import Home from '../Home/Home';
import MyPosts from '../MyPosts/MyPosts';

export default function Routing() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/post" element={<Post />} />
          <Route path="/myposts" element={<MyPosts />} />
        </Routes>
      </div>
    </div>
  );
}
