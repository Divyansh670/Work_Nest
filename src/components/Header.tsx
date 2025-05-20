
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="flex justify-between items-center p-4 bg-black/30 shadow-md">
      <div className="flex items-center gap-2">
        <div className="font-bold text-xl text-worknest-primary">WorkNest</div>
      </div>
      
      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="hidden md:flex flex-col items-end">
              <span className="font-medium">
                Hello <span className="text-worknest-primary">{user.name.split(' ')[0]}</span> 👋
              </span>
              <span className="text-xs text-gray-400">{user.role}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md transition-colors"
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
