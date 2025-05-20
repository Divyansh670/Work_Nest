
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { EmployeeProvider } from "./contexts/EmployeeContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import LeaveRequests from "./pages/LeaveRequests";
import Profile from "./pages/Profile";
import Leave from "./pages/Leave";
import Attendance from "./pages/Attendance";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <EmployeeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                
                {/* Admin routes */}
                <Route path="employees" element={
                  <ProtectedRoute requiredRole="admin">
                    <Employees />
                  </ProtectedRoute>
                } />
                <Route path="departments" element={
                  <ProtectedRoute requiredRole="admin">
                    <Departments />
                  </ProtectedRoute>
                } />
                <Route path="leave-requests" element={
                  <ProtectedRoute requiredRole="admin">
                    <LeaveRequests />
                  </ProtectedRoute>
                } />
                
                {/* Employee routes */}
                <Route path="attendance" element={
                  <ProtectedRoute requiredRole="employee">
                    <Attendance />
                  </ProtectedRoute>
                } />
                <Route path="leave" element={
                  <ProtectedRoute requiredRole="employee">
                    <Leave />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </EmployeeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
