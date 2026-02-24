import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import Profile from './pages/Profile';
import LostFound from './pages/LostFound';
import Developer from './pages/Developer';
import Chat from './pages/Chat';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="885600468877-1actl2fcqssr46r4shnnup1bskgol2cj.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/lost-found" element={<LostFound />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/chat/:sellerId" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
