// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import Eye from '../../../assets/Icons/Eye';
// import EyeOff from '../../../assets/Icons/EyeOff';
// import { useNavigate } from 'react-router-dom';
// import bgImg from '../../../assets/Images/Group33.png'
// import groupImg from '../../../assets/Images/GroupImgLogin.png'
// import { commonAPI } from '../../../services/commonAPI';
// import { useAuth } from '../../../context/AuthContext';


// type Props = {}

// function Login({ }: Props) {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login,isAuthenticated } = useAuth();

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

// useEffect(() => {
//   if(isAuthenticated){
//     navigate('/');
//   }
// }, [isAuthenticated,navigate])

//   const handleLogin = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setError("");
//     setIsLoading(true);

//     try {
//       // Validate inputs
//       if (!email || !password) {
//         toast.error('Please fill in all fields');
//         setIsLoading(false);
//         return;
//       }

//       // API call endpoint
//       const response = await commonAPI('POST', 'http://localhost:5001/login', { username: email, password });

//       // If login is successful
//       if (response.status === 200) {
//         login();
//         navigate('/dashboard');
//         toast.success('Login successful');
//       }
//     } catch (err: any) {
//       // Handle error responses
//       if (err.response) {
//         // Backend-specific error message
//         const errorMessage = err.response.data?.error || 'Login failed';
//         setError(errorMessage);
//         toast.error(errorMessage);
//       } else {
//         // Network or other error
//         const errorMessage = err.message || 'An unknown error occurred';
//         setError(errorMessage);
//         toast.error(errorMessage);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="h-[100vh] flex flex-col-reverse sm:flex-row">
//       <div className="w-full sm:w-[50%] justify-center flex items-center bg-white p-4 sm:p-0">
//         <div className="w-full sm:w-[60%]">
//           <p className="text-[#101828] font-[700] text-[24px] sm:text-[36px]">Sign In to Cygnozbot</p>
//           <p className="text-[#667085] mt-2 text-[16px] sm:text-[18px] font-[400]">AI-Powered Chatbots, Simplified for Everyone</p>
//           <form className="mt-8 space-y-6" onSubmit={handleLogin}>
//         <div className="rounded-md shadow-sm space-y-4">
//           <div>
//             <label htmlFor="email" className="text-dropdownText text-sm">
//           Email
//             </label>
//             <input
//           id="email"
//           name="email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="pl-3 text-sm w-full rounded-md text-start mt-1.5 bg-white border border-inputBorder h-[39px] leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
//           placeholder="Enter Email"
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="text-dropdownText text-sm">
//           Password
//             </label>
//             <div className="relative">
//           <input
//             id="password"
//             name="password"
//             type={showPassword ? 'text' : 'password'}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="pl-3 text-sm w-full rounded-md text-start mt-1.5 bg-white border border-inputBorder h-[39px] leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
//             placeholder="Password"
//           />
//           <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//             <button
//               type="button"
//               onClick={togglePasswordVisibility}
//               className="focus:outline-none mt-1"
//             >
//               {showPassword ? (
//             <Eye color='#4B5C79' />
//               ) : (
//             <EyeOff />
//               )}
//             </button>
//           </div>
//             </div>
//           </div>
//         </div>
//         <div className='flex justify-between'>
//           <div>
//             <input className='me-1' type="radio" />
//             <label htmlFor="">Remember me</label>
//           </div>
//           <a href="">
//             <p className='text-[#9747FF] text-[13px] font-[500]'>Forgot Password?</p>
//           </a>
//         </div>
//         <div className="flex justify-center">
//           <button
//             type="submit"
//             className="w-full py-2 bg-purple-500 rounded-md disabled:opacity-50"
//             disabled={isLoading}
//           >
//             <h1 className='text-zinc-50'>{isLoading ? "Sign In..." : "Sign In"}</h1>
//           </button>
//         </div>
//         <div className='text-center text-[15px]'>
//           <p>Don’t have a account? <a className='text-[#101828] font-bold' href="">Sign Up</a></p>
//         </div>
//           </form>
//         </div>
//       </div>
//       {/* Right side with the bgImage */}
//       <div className="w-[50%] hidden sm:block py-5 ps-5">
//         <div className=''
//           style={{
//             backgroundImage: `url(${bgImg})`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             backgroundRepeat: 'no-repeat',
//             width: '600px',
//             height: '100%',
//           }}>
//           <div className="">
//             <div className=''>
//               <h2 className="text-[20px] py-5 ps-5 text-[#FFFFFF] font-[900]">Cygnozbot</h2>
//               <div className='py-2 flex justify-center'>
//                 <img className='w-[65%]' src={groupImg} alt="" />
//               </div>
//               <div className='text-center px-5 pt-4'>
//                 <h1 className='text-[36px] text-[#FFFFFF] font-[400]'>AI Chatbots Made Simple</h1>
//                 <p className='text-[#FFFFFF] text-[16px] text-[400] px-5 py-2'>Cygnoz Bot helps you create, integrate, and deploy AI chatbots to enhance engagement and automate workflows. Transform interactions into meaningful connections effortlessly</p>
//               </div>
//               <div className=' justify-center flex pt-5'>
//                 <div className="w-9 h-2 bg-white rounded-lg"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* <Toaster position="top-right" /> */}
//     </div>
//   );
// }

// export default Login;

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Eye from '../../../assets/Icons/Eye';
import EyeOff from '../../../assets/Icons/EyeOff';
import { useNavigate } from 'react-router-dom';
import bgImg from '../../../assets/Images/Group33.png';
import groupImg from '../../../assets/Images/GroupImgLogin.png';
import { commonAPI } from '../../../services/commonAPI';

function Login() {
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
      if (!email || !password) {
        toast.error('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      const response = await commonAPI('POST', 'http://localhost:5001/login', { username: email, password });

      if (response.status === 200) {
        navigate('/dashboard');
        toast.success('Login successful');
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
    <div className="h-[100vh] flex flex-col-reverse sm:flex-row">
      <div className="w-full sm:w-[50%] justify-center flex items-center bg-white p-4 sm:p-0">
        <div className="w-full sm:w-[60%]">
          <p className="text-[#101828] font-[700] text-[24px] sm:text-[36px]">Sign In to Cygnozbot</p>
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
      <div className="w-[50%] hidden sm:block py-5 ps-5">
        <div style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', width: '600px', height: '100%' }}>
          <div>
            <h2 className="text-[20px] py-5 ps-5 text-[#FFFFFF] font-[900]">Cygnozbot</h2>
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
    </div>
  );
}

export default Login;
