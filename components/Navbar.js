'use client';

import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ClientOnly from './ClientOnly';

const NavLink = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href} 
      className={`${
        isActive 
          ? 'text-blue-600 font-medium border-b-2 border-blue-600' 
          : 'text-gray-700 hover:text-blue-600'
      } transition-colors duration-200 py-1`}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <nav className="max-w-4xl mx-auto bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold text-blue-600">
            HCV Predictor
          </Link>
          
          <ClientOnly>
            <div className="flex items-center space-x-4">
              {!loading && (
                <>
                  {user ? (
                    <>
                      <NavLink href="/dashboard">
                        Dashboard
                      </NavLink>
                      <NavLink href="/predict">
                        Predict
                      </NavLink>
                      <NavLink href="/profile">
                        Profile
                      </NavLink>
                      <button
                        onClick={logout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink href="/login">
                        Login
                      </NavLink>
                      <Link 
                        href="/register" 
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </ClientOnly>
        </div>
      </div>
    </nav>
  );
}