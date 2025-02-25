import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {};

function NoAccess({}: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/');
    }, 3000);
  }, []);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg text-center max-w-sm animate-blink">
          <div className="text-red-500 text-5xl mb-3 border-4 rounded-full h-16 w-16 flex justify-center items-center bg-slate-50 animate-bounce">
            <p className="-mt-2">&times;</p>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You can't access our services because you are{' '}
            <span className="font-bold italic text-red-800">no longer</span> a user.
          </p>
          <p className="text-lg text-blue-500 font-bold italic">
            Redirecting to the login page<span className="loading-dots transition-all duration-300">...</span>
          </p>
        </div>
      </div>

      <style>
        {`
          @keyframes blink {
            0%, 100% {
              box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
            }
            50% {
              box-shadow: 0 4px 15px rgba(239, 68, 68, 1);
            }
          }
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          @keyframes loading {
            0% {
              content: '';
            }
            33% {
              content: '.';
            }
            66% {
              content: '..';
            }
            100% {
              content: '...';
            }
          }
          .animate-blink {
            animation: blink 1s infinite;
          }
          .animate-bounce {
            animation: bounce 1s infinite;
          }
          .loading-dots::after {
            content: '';
            display: inline-block;
            animation: loading 1.5s infinite steps(4);
          }
        `}
      </style>
    </>
  );
}

export default NoAccess;
