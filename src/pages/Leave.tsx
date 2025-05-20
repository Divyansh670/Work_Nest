
import React, { useState } from 'react';
import { useEmployees } from '../contexts/EmployeeContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const Leave: React.FC = () => {
  const { user } = useAuth();
  const { employees, submitLeaveRequest } = useEmployees();
  const { toast } = useToast();
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  
  if (!user || user.role !== 'employee') return null;
  
  // Find the employee record for the current user
  const employeeData = employees.find(emp => emp.email === user.email);
  
  if (!employeeData) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!startDate || !endDate || !reason) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      toast({
        title: "Validation Error",
        description: "End date cannot be before start date",
        variant: "destructive"
      });
      return;
    }
    
    submitLeaveRequest({
      employeeId: employeeData.id,
      startDate,
      endDate,
      reason,
    });
    
    // Reset form
    setStartDate('');
    setEndDate('');
    setReason('');
    
    toast({
      title: "Success",
      description: "Leave request submitted successfully",
    });
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Request Leave</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-black/30 rounded-xl border border-gray-800 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                    min={startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Reason for Leave
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                  placeholder="Please provide a reason for your leave request..."
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-worknest-primary hover:bg-opacity-90 text-white rounded-lg transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-black/30 rounded-xl border border-gray-800 p-6">
            <h3 className="font-medium mb-4">Leave Policy</h3>
            
            <div className="space-y-3 text-sm">
              <p className="text-gray-300">
                Employees are entitled to 15 days of paid leave per year.
              </p>
              <p className="text-gray-300">
                Leave requests should be submitted at least 7 days in advance for planned leaves.
              </p>
              <p className="text-gray-300">
                Emergency or medical leaves can be requested with shorter notice.
              </p>
              <p className="text-gray-300">
                All leave requests are subject to manager approval and workload considerations.
              </p>
            </div>
            
            <div className="mt-4 bg-black/20 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-worknest-primary">Your Leave Balance</h4>
              <p>15 days remaining</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leave;
