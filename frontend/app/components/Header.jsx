import React from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();

  const handleClick = (path) => {
    router.push(path);
  };

  return (
    <header className="bg-blue-950 text-white p-4 mb-4">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <h1 
          className="text-3xl font-extrabold cursor-pointer mb-4 md:mb-0"
          onClick={() => handleClick('/')}
        >
          HealthCare
        </h1>
        <nav className="flex flex-wrap space-x-4 md:space-x-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleClick('/dashboard');
            }}
            className="text-lg font-bold hover:text-blue-300 transition-colors duration-300 hover:underline"
          >
            Dashboard
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleClick('/');
            }}
            className="text-lg font-bold hover:text-blue-300 transition-colors duration-300 hover:underline"
          >
            Patient List
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleClick('/appointments');
            }}
            className="text-lg font-bold hover:text-blue-300 transition-colors duration-300 hover:underline"
          >
            Appointments Calendar
          </a>
          {/* <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleClick('/logout');
            }}
            className="text-lg font-bold hover:text-red-300 transition-colors duration-300 hover:underline"
          >
            Logout
          </a> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
