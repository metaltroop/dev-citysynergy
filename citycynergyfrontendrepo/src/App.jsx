// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import TenderDashboard from './pages/TenderDashboard';
import { LoadingProvider } from './context/LoadingContext';
import {OTPVerification } from './pages/OTPVerification';

export default function App() {
  return (
    <LoadingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path='/home' element={<Home/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          <Route path="/dashboard" element={<TenderDashboard />} /> 
        </Routes>
      </Router>
    </LoadingProvider>
  );
}