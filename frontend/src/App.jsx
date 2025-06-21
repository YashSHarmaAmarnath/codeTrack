import './App.css';
import React from "react";
import Login from './components/Login';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import { NavBar } from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import Leetcode from './components/Leetcode';
import { Codechef } from './components/Codechef';
import CodeforcesProfile from './components/CodeforcesProfile';
import { SidebarRibbon } from './components/SidebarRibbon';
import LeetCodeQuestion from './components/LeetCodeQuestion';
import { Company } from './components/Company';
import { DownloadCSV } from './components/DownloadCSV';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <NavBar/>
                <SidebarRibbon/>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/leetcode" element={
            <ProtectedRoute>
                <NavBar/>
                <SidebarRibbon/>
                <Leetcode/>
              </ProtectedRoute>
            } />

          <Route path="/codechef" element={
            <ProtectedRoute>
                <NavBar/>
                <SidebarRibbon/>
                <Codechef/>
              </ProtectedRoute>
            } />
          <Route path="/codeforces" element={
            <ProtectedRoute>
                <NavBar/>
                <SidebarRibbon/>
                <CodeforcesProfile/>
              </ProtectedRoute>
            } />
          <Route path="/leetCodeProblems" element={
            <ProtectedRoute>
                <NavBar/>
                <SidebarRibbon/>
                <LeetCodeQuestion/>
              </ProtectedRoute>
            } />
          <Route path="/company" element={
            <ProtectedRoute>
                <NavBar/>
                <SidebarRibbon/>
                <Company/>
              </ProtectedRoute>
            } />
          <Route path="/downloadCSV" element={
            <ProtectedRoute>
                <NavBar/>
                <SidebarRibbon/>
                <DownloadCSV/>
              </ProtectedRoute>
            } />
          <Route path="/contact" element={<p>Contact</p>} />
          <Route path="*" element={<p>NotFound</p>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
