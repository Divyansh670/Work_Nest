
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEmployees } from '../contexts/EmployeeContext';
import { useToast } from '../hooks/use-toast';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { employees, updateEmployee, getLeaveRequestsByEmployee } = useEmployees();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: '',
    address: '',
  });
  
  if (!user) return null;
  
  // For employee view, get their full employee record
  const employeeData = user.role === 'employee' 
    ? employees.find(emp => emp.email === user.email)
    : null;
  
  // Get leave requests if employee
  const leaveRequests = employeeData
    ? getLeaveRequestsByEmployee(employeeData.id)
    : [];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (employeeData) {
      updateEmployee(employeeData.id, {
        ...formData,
      });
      
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    }
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-black/30 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6">
              {!isEditing ? (
                <div>
                  <div className="flex items-center mb-6">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=10B981&color=fff`}
                      alt="User avatar"
                      className="w-20 h-20 rounded-full mr-6"
                    />
                    <div>
                      <h2 className="text-2xl font-bold">{user.name}</h2>
                      <p className="text-gray-400">{employeeData?.position || user.role}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-4">Personal Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Email Address</p>
                          <p className="text-white">{user.email}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-400">Phone Number</p>
                          <p className="text-white">{employeeData?.phoneNumber || "Not specified"}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-400">Address</p>
                          <p className="text-white">{employeeData?.address || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-4">Employment Details</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Department</p>
                          <p className="text-white">{employeeData?.department || user.department || "Not specified"}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-400">Position</p>
                          <p className="text-white">{employeeData?.position || user.position || "Not specified"}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-400">Joining Date</p>
                          <p className="text-white">
                            {employeeData?.joiningDate 
                              ? new Date(employeeData.joiningDate).toLocaleDateString() 
                              : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {user.role === 'employee' && (
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => {
                          setFormData({
                            name: user.name,
                            email: user.email,
                            phoneNumber: employeeData?.phoneNumber || '',
                            address: employeeData?.address || '',
                          });
                          setIsEditing(true);
                        }}
                        className="px-4 py-2 bg-worknest-primary hover:bg-opacity-90 text-white rounded-lg transition-colors"
                      >
                        Edit Profile
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="font-medium mb-4">Edit Profile</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-worknest-primary hover:bg-opacity-90 text-white rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        <div>
          {user.role === 'employee' && (
            <div className="bg-black/30 rounded-xl border border-gray-800 p-6">
              <h3 className="font-medium mb-4">Leave Requests</h3>
              
              {leaveRequests.length > 0 ? (
                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                    <div 
                      key={request.id}
                      className="bg-black/20 border border-gray-800 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm">
                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            Requested: {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`
                          text-xs font-medium py-1 px-2 rounded-full
                          ${request.status === 'approved' ? 'bg-green-900/50 text-green-400' : ''}
                          ${request.status === 'rejected' ? 'bg-red-900/50 text-red-400' : ''}
                          ${request.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' : ''}
                        `}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm">{request.reason}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No leave requests found</p>
              )}
              
              <div className="mt-4">
                <button
                  onClick={() => window.location.href = '/leave'}
                  className="w-full px-4 py-2 bg-worknest-primary hover:bg-opacity-90 text-white rounded-lg transition-colors"
                >
                  New Leave Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
