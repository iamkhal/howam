import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { UserTypeSelection } from './components/UserTypeSelection';
import { ChatInterface } from './components/ChatInterface';
import { BrandingSettings } from './components/settings/BrandingSettings';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/user-type" element={<UserTypeSelection onSelect={() => {}} />} />
          <Route path="/chat" element={<ChatInterface userType="teen" userId="" />} />
          <Route path="/settings" element={<BrandingSettings />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;