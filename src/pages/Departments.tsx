
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEmployees } from '../contexts/EmployeeContext';

const Departments: React.FC = () => {
  const { user } = useAuth();
  const { employees } = useEmployees();
  
  if (!user || user.role !== 'admin') return null;
  
  // Group employees by department and calculate statistics
  const departments = employees.reduce((acc, employee) => {
    const dept = employee.department;
    
    if (!acc[dept]) {
      acc[dept] = {
        name: dept,
        employeeCount: 0,
        activeCount: 0,
        inactiveCount: 0,
        onLeaveCount: 0,
        employees: []
      };
    }
    
    acc[dept].employeeCount += 1;
    
    if (employee.status === 'active') {
      acc[dept].activeCount += 1;
    } else if (employee.status === 'inactive') {
      acc[dept].inactiveCount += 1;
    } else if (employee.status === 'on-leave') {
      acc[dept].onLeaveCount += 1;
    }
    
    acc[dept].employees.push(employee);
    
    return acc;
  }, {});
  
  const getDepartmentColor = (index: number) => {
    const colors = ['#FF6B6B', '#4D9EFF', '#10B981', '#B476F3', '#FF9F45', '#FFD166'];
    return colors[index % colors.length];
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Departments</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(departments).map((dept: any, index) => (
          <div 
            key={dept.name}
            className="bg-black/30 rounded-xl border border-gray-800 overflow-hidden"
          >
            <div 
              className="p-6"
              style={{ borderTop: `4px solid ${getDepartmentColor(index)}` }}
            >
              <h2 className="text-xl font-bold mb-4">{dept.name}</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-black/30 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{dept.employeeCount}</div>
                  <div className="text-xs text-gray-400">Total</div>
                </div>
                
                <div className="bg-black/30 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-400">{dept.activeCount}</div>
                  <div className="text-xs text-gray-400">Active</div>
                </div>
                
                <div className="bg-black/30 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-amber-400">{dept.onLeaveCount}</div>
                  <div className="text-xs text-gray-400">On Leave</div>
                </div>
              </div>
              
              <h3 className="font-medium mb-2">Team Members</h3>
              <div className="space-y-2">
                {dept.employees.map(employee => (
                  <div 
                    key={employee.id}
                    className="flex items-center justify-between bg-black/20 p-2 rounded-lg"
                  >
                    <div className="flex items-center">
                      {employee.avatar && (
                        <img 
                          src={employee.avatar} 
                          alt={`${employee.name}'s avatar`}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                      )}
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-xs text-gray-400">{employee.position}</div>
                      </div>
                    </div>
                    <span className={`
                      text-xs py-1 px-2 rounded-full
                      ${employee.status === 'active' ? 'bg-green-900/50 text-green-400' : ''}
                      ${employee.status === 'inactive' ? 'bg-gray-900/50 text-gray-400' : ''}
                      ${employee.status === 'on-leave' ? 'bg-amber-900/50 text-amber-400' : ''}
                    `}>
                      {employee.status.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;
