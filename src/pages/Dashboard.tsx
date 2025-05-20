
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEmployees, ActivityItem } from '../contexts/EmployeeContext';

const StatCard = ({ 
  title, 
  value, 
  color 
}: { 
  title: string; 
  value: number | string;
  color: string;
}) => (
  <div 
    className={`task-card animate-slide-up`} 
    style={{ backgroundColor: color }}
  >
    <div className="text-4xl font-bold mb-2">{value}</div>
    <div className="text-sm opacity-90">{title}</div>
  </div>
);

const ActivityCard = ({ activity }: { activity: ActivityItem }) => {
  // Format the timestamp to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Choose icon based on activity type
  let icon = '📝';
  if (activity.type === 'employee_added') icon = '👤';
  if (activity.type === 'employee_updated') icon = '✏️';
  if (activity.type === 'employee_removed') icon = '🗑️';
  if (activity.type === 'leave_requested') icon = '📅';
  if (activity.type === 'leave_updated') icon = '✓';

  return (
    <div className="bg-black/30 p-3 rounded-lg border border-gray-800 mb-3 animate-slide-up">
      <div className="flex items-start">
        <div className="w-8 h-8 mr-3 flex items-center justify-center">
          <span className="text-xl">{icon}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-300">{activity.description}</p>
          <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ 
  title, 
  date, 
  priority = 'High',
  color 
}: { 
  title: string; 
  date: string;
  priority?: string;
  color: string;
}) => (
  <div 
    className={`task-card mb-4`} 
    style={{ backgroundColor: color }}
  >
    <div className="flex justify-between items-start mb-3">
      <span className="priority-badge priority-high">{priority}</span>
      <span className="text-xs text-white/80">{date}</span>
    </div>
    <h3 className="text-lg font-medium mb-1">{title}</h3>
    <p className="text-sm text-white/80 line-clamp-3">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti neque illum sapiente alias earum!
    </p>
  </div>
);

const AdminDashboard: React.FC = () => {
  const { 
    employees, 
    getActiveEmployeesCount, 
    getDepartmentsCount,
    getRecentActivities 
  } = useEmployees();
  
  const activities = getRecentActivities();
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard 
          title="Total Employees" 
          value={employees.length} 
          color="#FF6B6B" 
        />
        <StatCard 
          title="Active Employees" 
          value={getActiveEmployeesCount()} 
          color="#4D9EFF" 
        />
        <StatCard 
          title="Departments" 
          value={getDepartmentsCount()} 
          color="#10B981" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Upcoming Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TaskCard 
              title="Review Q2 Performance Reports" 
              date="18 June 2025" 
              color="#FF9F45" 
            />
            <TaskCard 
              title="Prepare Budget Proposal" 
              date="25 June 2025"
              color="#B476F3"
            />
            <TaskCard 
              title="Schedule Team Building Event" 
              date="03 July 2025"
              color="#FFD166"
            />
            <TaskCard 
              title="Update Employee Handbook" 
              date="15 July 2025"
              color="#4D9EFF"
            />
          </div>
        </div>
        
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Tasks Completed" 
          value="0" 
          color="#10B981" 
        />
        <StatCard 
          title="Pending Tasks" 
          value="0" 
          color="#4D9EFF" 
        />
        <StatCard 
          title="Attendance Rate" 
          value="100%" 
          color="#B476F3" 
        />
        <StatCard 
          title="Leave Balance" 
          value="15 days" 
          color="#FF6B6B" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">My Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TaskCard 
              title="Complete Assignment" 
              date="10 April 2025" 
              color="#FF6B6B" 
            />
            <TaskCard 
              title="LinkedIn Post" 
              date="18 April 2025"
              color="#FFD166"
            />
            <TaskCard 
              title="Make a React Project" 
              date="20 March 2025"
              color="#FF9F45"
            />
            <TaskCard 
              title="Do DSA problems" 
              date="25 March 2025"
              color="#B476F3"
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Announcements</h2>
          <div className="bg-black/30 rounded-lg border border-gray-800 p-4 space-y-4">
            <div>
              <h3 className="font-medium mb-1">Company Picnic</h3>
              <p className="text-sm text-gray-400">Annual company picnic scheduled for June 15th at Central Park.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Office Closure</h3>
              <p className="text-sm text-gray-400">Office will be closed on May 27th for Memorial Day.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Upcoming Training</h3>
              <p className="text-sm text-gray-400">New project management software training on June 5th.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Combined Dashboard component that renders based on user role
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Render dashboard based on user role
  return user.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />;
};

export default Dashboard;
