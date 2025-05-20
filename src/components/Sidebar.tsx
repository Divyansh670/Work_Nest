
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const isAdmin = user.role === 'admin';
  
  // Links common to both roles
  let links = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/profile', label: 'My Profile', icon: '👤' },
  ];
  
  // Admin-specific links
  if (isAdmin) {
    links = [
      ...links,
      { to: '/employees', label: 'Employees', icon: '👥' },
      { to: '/departments', label: 'Departments', icon: '🏢' },
      { to: '/leave-requests', label: 'Leave Requests', icon: '📅' },
    ];
  } 
  // Employee-specific links
  else {
    links = [
      ...links,
      { to: '/attendance', label: 'My Attendance', icon: '🕒' },
      { to: '/leave', label: 'Request Leave', icon: '📝' },
    ];
  }

  return (
    <aside className="w-16 md:w-64 bg-black/40 text-white">
      <div className="p-4 h-full">
        <div className="mb-6 pt-2 hidden md:block">
          <h2 className="text-xl font-bold text-worknest-primary">WorkNest</h2>
          <p className="text-xs text-gray-400">{isAdmin ? 'Admin Portal' : 'Employee Portal'}</p>
        </div>
        
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                flex items-center py-3 px-3 rounded-lg transition-colors
                ${isActive ? 'bg-worknest-primary text-white' : 'hover:bg-black/20 text-gray-300'}
              `}
            >
              <span className="mr-3 text-xl md:text-base">{link.icon}</span>
              <span className="hidden md:block">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
