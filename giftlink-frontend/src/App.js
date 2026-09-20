import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
<<<<<<< HEAD
=======
import SearchPage from './components/SearchPage/SearchPage';
>>>>>>> eec4f36 (Adding temporary changes to Github)
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/app" element={<MainPage />} />
        <Route path="/app/login" element={<LoginPage />} />
        <Route path="/app/register" element={<RegisterPage />} />
<<<<<<< HEAD
=======
        <Route path="/app/search" element={<SearchPage />} />
>>>>>>> eec4f36 (Adding temporary changes to Github)
      </Routes>
    </>
  );
}

export default App;
