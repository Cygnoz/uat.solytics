import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Eye from '../../../assets/FrameIcons/Eye';
import EyeOff from '../../../assets/FrameIcons/EyeOff';
// import { useNavigate } from 'react-router-dom';
import bgImg from '../../../assets/FrameImages/Group33.png';
import groupImg from '../../../assets/FrameImages/GroupImgLogin.png';
import { useNavigate } from 'react-router-dom';
import { endpoints } from '../../../Services/apiEndpoints';
import axiosInstance from '../../../Services/axiosInstance';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        toast.error('Please fill in all fields');
        setIsLoading(false);
        return;
      }
      const apiInstance = axiosInstance.baseInstance(5001);
      const response = await apiInstance.post(endpoints.LOGIN, {
        username: email,
        password: password
      });

      // Check for message instead of token
      if (response.data?.message === "Login successful") {
        // Create a placeholder token if needed
        const placeholderToken = `user_${email}_${Date.now()}`;
        sessionStorage.setItem('authToken', placeholderToken);

        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        throw new Error('Login failed');
      }

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100vh] grid grid-cols-2 max-sm:grid-cols-1">
      <div className="w-full  justify-center flex items-center bg-white p-4 sm:p-0">
        <div className="w-full sm:w-[60%]">
          <p className="text-[#101828] font-[700] text-[24px] sm:text-[36px]">Sign In to Solytics</p>
          <p className="text-[#667085] mt-2 text-[16px] sm:text-[18px] font-[400]">AI-Powered Chatbots, Simplified for Everyone</p>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="text-dropdownText text-sm">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="pl-3 text-sm w-full rounded-md mt-1.5 bg-white border border-inputBorder h-[39px] focus:outline-none focus:border-darkRed" placeholder="Enter Email" />
              </div>
              <div>
                <label htmlFor="password" className="text-dropdownText text-sm">Password</label>
                <div className="relative">
                  <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="pl-3 text-sm w-full rounded-md mt-1.5 bg-white border border-inputBorder h-[39px] focus:outline-none focus:border-darkRed" placeholder="Password" />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button type="button" onClick={togglePasswordVisibility} className="focus:outline-none mt-1">
                      {showPassword ? <Eye color='#4B5C79' /> : <EyeOff />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex justify-between'>
              <div>
                <input className='me-1' type="radio" />
                <label>Remember me</label>
              </div>
              <a href=""><p className='text-[#9747FF] text-[13px] font-[500]'>Forgot Password?</p></a>
            </div>
            <div className="flex justify-center">
              <button type="submit" className="w-full py-2 bg-purple-500 rounded-md disabled:opacity-50" disabled={isLoading}>
                <h1 className='text-zinc-50'>{isLoading ? "Sign In..." : "Sign In"}</h1>
              </button>
            </div>
            <div className='text-center text-[15px]'>
              <p>Don’t have an account? <a className='text-[#101828] font-bold' href="">Sign Up</a></p>
            </div>
          </form>
        </div>
      </div>
        <div className='w-full max-sm:hidden bg-[#6A24C5]' style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', height: '100%' }}>
          <div>
            <h2 className="text-[20px] py-5 ps-5 text-[#FFFFFF] font-[900]">Solytics</h2>
            <div className='py-2 flex justify-center'>
              <img className='w-[65%]' src={groupImg} alt="" />
            </div>
            <div className='text-center px-5 pt-4'>
              <h1 className='text-[36px] text-[#FFFFFF] font-[400]'>AI Chatbots Made Simple</h1>
              <p className='text-[#FFFFFF] text-[16px] text-[400] px-5 py-2'>Cygnoz Bot helps you create, integrate, and deploy AI chatbots to enhance engagement and automate workflows.</p>
            </div>
            <div className='justify-center flex pt-5'>
              <div className="w-9 h-2 bg-white rounded-lg"></div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Login;
 