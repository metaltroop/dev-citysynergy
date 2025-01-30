
// pages/OTPVerification.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export  const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120);
  const { state } = useLocation();
  const navigate = useNavigate();

  // Handle OTP input boxes
  const handleChange = (index, value) => {
    if (/^\d+$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value !== '' && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/${state?.flow}/initiate`, { email: state?.email });
      setTimer(120);
    } catch (error) {
      console.error('Resend failed:', error);
    }
  };

  // Handle countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle verification
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/${state?.flow}/complete`, {
        email: state?.email,
        otp: otp.join(''),
        password: state?.password
      });

      if (state?.flow === 'register') {
        navigate('/login');
      } else {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter the 6-digit code sent to {state?.email}
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-12 h-12 text-center border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Verify
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            {timer > 0 ? `Resend OTP in ${timer}s` : "Didn't receive code?"}
          </p>
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className={`text-blue-600 ${timer > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};