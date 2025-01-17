import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import Eye from '../../../assets/Icons/Eye';
import EyeOff from '../../../assets/Icons/EyeOff';
import dashScreenshort from '../../../assets/Images/dashScreenshort.png';
import { useNavigate } from 'react-router-dom';

type Props = {}

function Login({}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
      // Validate inputs
      if (!email || !password) {
        toast.error('Please fill in all fields');
        return;
      }

      // Add your login API call here
      // Example:
      // const response = await CheckLogin({ email, password });
      
      // For demonstration, simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If login is successful
      navigate('/dashboard');
      toast.success('Loggin successful');
      

      // If login fails, you might want to show an error
      // toast.error('Invalid credentials');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100vh] flex">
      <div className="w-[50%] flex justify-center items-center bg-white">
        <div className="w-[60%] ">
          <p className="text-textColor font-bold text-4xl">Get Started now</p>
          <p className="text-dropdownText mt-2 text-sm font-normal">Enter your credentials to access your account</p>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="text-dropdownText text-sm">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-3 text-sm w-[100%] rounded-md text-start mt-1.5 bg-white border border-inputBorder h-[39px] leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  placeholder="Enter Email"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-dropdownText text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-3 text-sm w-[100%] rounded-md text-start mt-1.5 bg-white border border-inputBorder h-[39px] leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    placeholder="Password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="focus:outline-none mt-1"
                    >
                      {showPassword ? (
                        <Eye color='#4B5C79'/>
                      ) : (
                        <EyeOff/>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-center">
              <button 
                type="submit" 
                className="px-[45%] h-8 mt-7 bg-purple-500 rounded-md disabled:opacity-50"
                disabled={isLoading}
              >
                <h1 className='text-zinc-50'>{isLoading ? "Logging in..." : "Login"}</h1>
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Right side with the bgImage */}
      <div className="w-[50%] flex justify-center items-center bg-[#CACCBE]">
        <div className="flex flex-col items-start justify-center w-[82%] h-full p-8">
          <div className='ms-[14%]'>
            <h2 className="text-textColor font-semibold text-3xl leading-tight mt-6">Lorem ipsum dolor <br /> dolor</h2>
            <p className="text-textColor mt-3 text-sm">Lorem adipiscing elit, sed do eiusmod tempor incididunt ut </p>
          </div>
          <img src={dashScreenshort} alt="Dashboard preview" className="mt-5 w-full"/>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default Login;