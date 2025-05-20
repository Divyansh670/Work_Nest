
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  joiningDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
  salary?: number;
  phoneNumber?: string;
  address?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface EmployeeContextType {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateLeaveRequest: (id: string, status: LeaveRequest['status']) => void;
  getLeaveRequestsByEmployee: (employeeId: string) => LeaveRequest[];
  getEmployeesByDepartment: (department: string) => Employee[];
  getActiveEmployeesCount: () => number;
  getDepartmentsCount: () => number;
  getRecentActivities: () => ActivityItem[];
}

// For activity tracking
export interface ActivityItem {
  id: string;
  type: 'employee_added' | 'employee_updated' | 'employee_removed' | 'leave_requested' | 'leave_updated';
  description: string;
  timestamp: string;
  employeeId?: string;
}

const EmployeeContext = createContext<EmployeeContextType>({
  employees: [],
  leaveRequests: [],
  addEmployee: () => {},
  updateEmployee: () => {},
  deleteEmployee: () => {},
  getEmployeeById: () => undefined,
  submitLeaveRequest: () => {},
  updateLeaveRequest: () => {},
  getLeaveRequestsByEmployee: () => [],
  getEmployeesByDepartment: () => [],
  getActiveEmployeesCount: () => 0,
  getDepartmentsCount: () => 0,
  getRecentActivities: () => [],
});

export const useEmployees = () => useContext(EmployeeContext);

// Generate random avatar
const getRandomAvatar = (name: string) => {
  const colors = ['0D8ABC', '27AE60', 'E67E22', '8E44AD', 'C0392B', '2C3E50'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=${randomColor}&color=fff`;
};

// Sample mock data
const initialEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@worknest.com',
    department: 'Engineering',
    position: 'Senior Developer',
    joiningDate: '2022-06-15',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=0D8ABC&color=fff',
    salary: 95000,
    phoneNumber: '555-123-4567',
    address: '123 Tech Lane, San Francisco, CA'
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily.johnson@worknest.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    joiningDate: '2022-08-01',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Emily+Johnson&background=8E44AD&color=fff',
    salary: 85000,
    phoneNumber: '555-987-6543',
    address: '456 Market Street, New York, NY'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@worknest.com',
    department: 'Design',
    position: 'Senior UI Designer',
    joiningDate: '2022-09-12',
    status: 'on-leave',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=27AE60&color=fff',
    salary: 88000,
    phoneNumber: '555-456-7890',
    address: '789 Design Ave, Seattle, WA'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@worknest.com',
    department: 'HR',
    position: 'HR Manager',
    joiningDate: '2021-11-05',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=C0392B&color=fff',
    salary: 92000,
    phoneNumber: '555-789-0123',
    address: '101 People Street, Chicago, IL'
  },
  {
    id: '5',
    name: 'David Rodriguez',
    email: 'david.rodriguez@worknest.com',
    department: 'Engineering',
    position: 'DevOps Engineer',
    joiningDate: '2023-01-20',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=David+Rodriguez&background=2C3E50&color=fff',
    salary: 98000,
    phoneNumber: '555-321-6547',
    address: '234 Cloud Road, Austin, TX'
  }
];

const initialLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '3',
    startDate: '2025-05-15',
    endDate: '2025-05-20',
    reason: 'Family vacation',
    status: 'approved',
    createdAt: '2025-05-01T10:30:00Z'
  },
  {
    id: '2',
    employeeId: '2',
    startDate: '2025-06-10',
    endDate: '2025-06-12',
    reason: 'Medical appointment',
    status: 'pending',
    createdAt: '2025-05-18T09:15:00Z'
  }
];

const initialActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'employee_added',
    description: 'Added new employee: David Rodriguez',
    timestamp: '2025-05-18T14:30:00Z',
    employeeId: '5'
  },
  {
    id: '2',
    type: 'leave_updated',
    description: 'Approved leave request for Michael Chen',
    timestamp: '2025-05-17T11:45:00Z',
    employeeId: '3'
  },
  {
    id: '3',
    type: 'employee_updated',
    description: 'Updated details for Emily Johnson',
    timestamp: '2025-05-16T16:20:00Z',
    employeeId: '2'
  }
];

interface EmployeeProviderProps {
  children: ReactNode;
}

export const EmployeeProvider: React.FC<EmployeeProviderProps> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  
  const addActivity = (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newActivity = {
      ...activity,
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    
    setActivities(prev => [newActivity, ...prev].slice(0, 10)); // Keep only last 10 activities
  };
  
  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee = {
      ...employee,
      id: `emp_${Date.now()}`,
      avatar: employee.avatar || getRandomAvatar(employee.name),
    };
    
    setEmployees(prev => [...prev, newEmployee]);
    
    addActivity({
      type: 'employee_added',
      description: `Added new employee: ${employee.name}`,
      employeeId: newEmployee.id,
    });
  };
  
  const updateEmployee = (id: string, updatedFields: Partial<Employee>) => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === id 
          ? { ...emp, ...updatedFields } 
          : emp
      )
    );
    
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
      addActivity({
        type: 'employee_updated',
        description: `Updated details for ${employee.name}`,
        employeeId: id,
      });
    }
  };
  
  const deleteEmployee = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    
    if (employee) {
      addActivity({
        type: 'employee_removed',
        description: `Removed employee: ${employee.name}`,
        employeeId: id,
      });
    }
  };
  
  const getEmployeeById = (id: string) => employees.find(emp => emp.id === id);
  
  const submitLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: `leave_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    
    setLeaveRequests(prev => [...prev, newRequest]);
    
    const employee = getEmployeeById(request.employeeId);
    if (employee) {
      addActivity({
        type: 'leave_requested',
        description: `New leave request from ${employee.name}`,
        employeeId: request.employeeId,
      });
    }
  };
  
  const updateLeaveRequest = (id: string, status: LeaveRequest['status']) => {
    setLeaveRequests(prev => 
      prev.map(req => 
        req.id === id 
          ? { ...req, status } 
          : req
      )
    );
    
    const request = leaveRequests.find(req => req.id === id);
    if (request) {
      const employee = getEmployeeById(request.employeeId);
      if (employee) {
        addActivity({
          type: 'leave_updated',
          description: `${status.charAt(0).toUpperCase() + status.slice(1)} leave request for ${employee.name}`,
          employeeId: request.employeeId,
        });
      }
    }
  };
  
  const getLeaveRequestsByEmployee = (employeeId: string) => 
    leaveRequests.filter(req => req.employeeId === employeeId);
  
  const getEmployeesByDepartment = (department: string) => 
    employees.filter(emp => emp.department === department);
  
  const getActiveEmployeesCount = () => 
    employees.filter(emp => emp.status === 'active').length;
    
  const getDepartmentsCount = () => 
    new Set(employees.map(emp => emp.department)).size;

  const getRecentActivities = () => activities;
  
  return (
    <EmployeeContext.Provider 
      value={{
        employees,
        leaveRequests,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployeeById,
        submitLeaveRequest,
        updateLeaveRequest,
        getLeaveRequestsByEmployee,
        getEmployeesByDepartment,
        getActiveEmployeesCount,
        getDepartmentsCount,
        getRecentActivities,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
