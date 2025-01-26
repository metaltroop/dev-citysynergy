// Register.jsx
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons
import ReCAPTCHA from "react-google-recaptcha";
import mhlogo from "../assets/mhgovlogo.png";
import axios from "axios";
import { useLoading } from "../context/LoadingContext";


export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle confirm password visibility
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptcha = useRef(null);
  const { setIsLoading } = useLoading();


  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!captchaToken) {
      setError("Please complete the reCAPTCHA");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post("https://citysynergybackend-jw8z.onrender.com/auth/register", {
        email,
        password,
        confirmPassword,
        captchaToken,
      });
      navigate("/login"); // Redirect to login page after successful registration
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }finally{
      setIsLoading(false);
    }
  };

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  return (
    <div className="bg-white flex items-center justify-center w-full h-screen relative">
      <img
        src="./registergirl.png"
        className="absolute z-0 4xl:translate-x-[80%] 3xl:translate-x-[65%] 2xl:translate-x-[50%] xl:translate-x-[45%] -translate-x-[100%] -translate-y-20"
        alt=""
      />
      <div className="bg-[#f5f5f5] 2xl:w-1/4 xl:w-1/4 2xl:h-[95%] xl:h-[88%] w-full h-full p-5 rounded-2xl shadow-xl z-10">
        <div className="p-2">
          <div className="flex justify-start mb-4">
            <Link
              to="/login"
              className="text-blue-500 hover:underline text-md mb-3 font-medium"
            >
              &larr; Login
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <img src={mhlogo} alt="Logo" className="w-20 h-20 mb-4" />
            <h2 className="text-xl sm:text-3xl font-semibold">CITY SYNERGY</h2>
            <p className="text-center text-gray-500 mt-2 mb-8">
              Register Your Account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister}>
            {/* Email Field */}
            <div className="relative mb-6">
              <label
                className={`absolute left-2 transition-all duration-200 transform ${
                  emailFocused ? "-top-2.5 text-sm bg-white px-1" : "top-4 text-base"
                } text-gray-500`}
              >
                Email
              </label>
              <input
                type="text"
                placeholder=" "
                className="w-full p-2 pt-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={(e) => setEmailFocused(e.target.value !== "")}
              />
            </div>

            {/* Password Field */}
            <div className="relative mb-6">
              <label
                className={`absolute left-2 transition-all duration-200 transform ${
                  passwordFocused ? "-top-2.5 text-sm bg-white px-1" : "top-4 text-base"
                } text-gray-500`}
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder=" "
                className="w-full p-2 pt-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={(e) => setPasswordFocused(e.target.value !== "")}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password Field */}
            <div className="relative mb-6">
              <label
                className={`absolute left-2 transition-all duration-200 transform ${
                  confirmPasswordFocused
                    ? "-top-2.5 text-sm bg-white px-1"
                    : "top-4 text-base"
                } text-gray-500`}
              >
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder=" "
                className="w-full p-2 pt-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={(e) => setConfirmPasswordFocused(e.target.value !== "")}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="flex items-center justify-center">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_SITE_KEY}
                onChange={onCaptchaChange}
                ref={recaptcha}
              />
            </div>
            
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 mb-4"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
