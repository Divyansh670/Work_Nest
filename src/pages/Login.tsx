
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, accept any non-empty email/password with the selected role
    if (email.trim() && password.trim()) {
      const success = login(email, password, role);
      
      if (success) {
        toast({
          title: "Login successful",
          description: `Welcome to WorkNest ${role} portal`,
        });
        navigate('/');
      } else {
        // For demo purposes, show mock users
        if (role === 'admin') {
          toast({
            title: "Login failed",
            description: "Try admin@worknest.com with any password",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login failed",
            description: "Try john@worknest.com with any password",
            variant: "destructive"
          });
        }
      }
    } else {
      toast({
        title: "Login failed",
        description: "Please enter both email and password",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-worknest-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Welcome to WorkNest
        </h1>
        
        <div className="bg-black/20 p-8 rounded-xl border border-gray-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/30 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-worknest-primary"
                placeholder="Enter your Email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/30 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-worknest-primary"
                placeholder="Enter Password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Login as
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className={`flex-1 py-3 px-4 rounded-lg border ${
                    role === 'employee' 
                      ? 'bg-worknest-primary border-transparent text-white' 
                      : 'bg-transparent border-gray-700 text-gray-300 hover:bg-black/30'
                  }`}
                  onClick={() => setRole('employee')}
                >
                  Employee
                </button>
                <button
                  type="button"
                  className={`flex-1 py-3 px-4 rounded-lg border ${
                    role === 'admin' 
                      ? 'bg-worknest-primary border-transparent text-white' 
                      : 'bg-transparent border-gray-700 text-gray-300 hover:bg-black/30'
                  }`}
                  onClick={() => setRole('admin')}
                >
                  Admin
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-worknest-primary hover:bg-opacity-90 text-white rounded-lg font-medium transition-colors"
            >
              Log in
            </button>
            
            <div className="text-center text-xs text-gray-500 mt-4">
              <p>Demo accounts:</p>
              <p>Admin: admin@worknest.com</p>
              <p>Employee: john@worknest.com</p>
              <p>(Use any password)</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
