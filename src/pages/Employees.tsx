
import React, { useState } from 'react';
import { useEmployees, Employee } from '../contexts/EmployeeContext';
import { useToast } from '../hooks/use-toast';
import { Dialog } from '@/components/ui/dialog';

const EmployeeCard = ({ 
  employee, 
  onEdit, 
  onDelete 
}: { 
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="bg-black/30 rounded-lg border border-gray-800 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center">
          {employee.avatar && (
            <img 
              src={employee.avatar} 
              alt={`${employee.name} avatar`}
              className="w-12 h-12 rounded-full mr-4"
            />
          )}
          <div>
            <h3 className="font-medium">{employee.name}</h3>
            <p className="text-sm text-gray-400">{employee.position}</p>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Department:</span>
            <span>{employee.department}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Email:</span>
            <span>{employee.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Joined:</span>
            <span>{new Date(employee.joiningDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Status:</span>
            <span className={`
              ${employee.status === 'active' && 'text-green-500'}
              ${employee.status === 'inactive' && 'text-gray-500'}
              ${employee.status === 'on-leave' && 'text-amber-500'}
            `}>
              {employee.status.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex border-t border-gray-800">
        <button 
          onClick={() => onEdit(employee)}
          className="flex-1 p-2 text-center text-blue-400 hover:bg-blue-400/10 transition-colors"
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(employee.id)}
          className="flex-1 p-2 text-center text-red-400 hover:bg-red-400/10 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

interface EmployeeFormData {
  name: string;
  email: string;
  department: string;
  position: string;
  joiningDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  phoneNumber?: string;
  address?: string;
  salary?: number;
}

const Employees: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    department: '',
    position: '',
    joiningDate: '',
    status: 'active',
  });
  
  // Get unique departments for filter
  const departments = Array.from(new Set(employees.map(emp => emp.department)));
  
  // Filter employees based on search and department filter
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      searchTerm === '' || 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      filterDepartment === '' || 
      employee.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'salary') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || undefined,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const handleAddEmployee = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.department || !formData.position || !formData.joiningDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    addEmployee(formData);
    setShowAddDialog(false);
    resetForm();
    
    toast({
      title: "Success",
      description: "Employee added successfully",
    });
  };
  
  const handleEditEmployee = () => {
    if (!currentEmployee) return;
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.department || !formData.position || !formData.joiningDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    updateEmployee(currentEmployee.id, formData);
    setShowEditDialog(false);
    resetForm();
    
    toast({
      title: "Success",
      description: "Employee updated successfully",
    });
  };
  
  const handleDeleteEmployee = () => {
    if (!currentEmployee) return;
    
    deleteEmployee(currentEmployee.id);
    setShowDeleteDialog(false);
    setCurrentEmployee(null);
    
    toast({
      title: "Success",
      description: "Employee deleted successfully",
    });
  };
  
  const openEditDialog = (employee: Employee) => {
    setCurrentEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      joiningDate: employee.joiningDate,
      status: employee.status,
      phoneNumber: employee.phoneNumber,
      address: employee.address,
      salary: employee.salary,
    });
    setShowEditDialog(true);
  };
  
  const openDeleteDialog = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
      setCurrentEmployee(employee);
      setShowDeleteDialog(true);
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      position: '',
      joiningDate: '',
      status: 'active',
    });
    setCurrentEmployee(null);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employees</h1>
        <button
          onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }}
          className="bg-worknest-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Employee
        </button>
      </div>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by name or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
          />
        </div>
        
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-400 mb-1">
            Filter by Department
          </label>
          <select
            id="department"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredEmployees.length === 0 ? (
        <p className="text-center text-gray-400 my-8">No employees found matching your search</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map(employee => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          ))}
        </div>
      )}
      
      {/* Add Employee Dialog */}
      {showAddDialog && (
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-gray-900 rounded-xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
              
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
                  <label className="block text-sm font-medium text-gray-400 mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Joining Date</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number (optional)</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Salary (optional)</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Address (optional)</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowAddDialog(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmployee}
                  className="px-4 py-2 bg-worknest-primary hover:bg-opacity-90 text-white rounded-lg transition-colors"
                >
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
      
      {/* Edit Employee Dialog */}
      {showEditDialog && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-gray-900 rounded-xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
              
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
                  <label className="block text-sm font-medium text-gray-400 mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Joining Date</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number (optional)</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Salary (optional)</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Address (optional)</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg bg-black/30 border border-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-worknest-primary"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowEditDialog(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditEmployee}
                  className="px-4 py-2 bg-worknest-primary hover:bg-opacity-90 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-gray-900 rounded-xl shadow-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Delete Employee</h2>
              <p className="text-gray-300">
                Are you sure you want to delete {currentEmployee?.name}? This action cannot be undone.
              </p>
              
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEmployee}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Employees;
