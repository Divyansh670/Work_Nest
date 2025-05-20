
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEmployees } from '../contexts/EmployeeContext';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from '../hooks/use-toast';

const LeaveRequests: React.FC = () => {
  const { user } = useAuth();
  const { leaveRequests, employees, updateLeaveRequest } = useEmployees();
  const { toast } = useToast();
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  
  if (!user || user.role !== 'admin') return null;
  
  // Group leave requests by status
  const pendingRequests = leaveRequests.filter(req => req.status === 'pending');
  const approvedRequests = leaveRequests.filter(req => req.status === 'approved');
  const rejectedRequests = leaveRequests.filter(req => req.status === 'rejected');
  
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Unknown Employee';
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleAction = (requestId: string, action: 'approve' | 'reject') => {
    setCurrentRequestId(requestId);
    setActionType(action);
    setShowConfirmModal(true);
  };
  
  const confirmAction = () => {
    if (!currentRequestId || !actionType) return;
    
    updateLeaveRequest(currentRequestId, actionType === 'approve' ? 'approved' : 'rejected');
    
    toast({
      title: "Success",
      description: `Leave request ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`,
    });
    
    setShowConfirmModal(false);
    setCurrentRequestId(null);
    setActionType(null);
  };
  
  const LeaveRequestCard = ({ request, isPending = false }) => {
    const employeeName = getEmployeeName(request.employeeId);
    
    return (
      <div className="bg-black/30 border border-gray-800 rounded-lg p-4 mb-3">
        <div className="flex justify-between">
          <div>
            <h4 className="font-medium">{employeeName}</h4>
            <p className="text-sm text-gray-400">
              {formatDate(request.startDate)} - {formatDate(request.endDate)}
            </p>
            <p className="text-sm mt-2">{request.reason}</p>
          </div>
          {isPending && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleAction(request.id, 'approve')}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(request.id, 'reject')}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
              >
                Reject
              </button>
            </div>
          )}
          {!isPending && (
            <div>
              <span className={`
                text-xs font-medium py-1 px-2 rounded-full
                ${request.status === 'approved' ? 'bg-green-900/50 text-green-400' : ''}
                ${request.status === 'rejected' ? 'bg-red-900/50 text-red-400' : ''}
              `}>
                {request.status}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Leave Requests</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Pending Requests ({pendingRequests.length})</h2>
          <div className="bg-black/30 rounded-xl border border-gray-800 p-4">
            {pendingRequests.length > 0 ? (
              pendingRequests.map(request => (
                <LeaveRequestCard 
                  key={request.id} 
                  request={request} 
                  isPending={true} 
                />
              ))
            ) : (
              <p className="text-gray-400">No pending requests</p>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Approved ({approvedRequests.length})</h2>
          <div className="bg-black/30 rounded-xl border border-gray-800 p-4">
            {approvedRequests.length > 0 ? (
              approvedRequests.map(request => (
                <LeaveRequestCard 
                  key={request.id} 
                  request={request} 
                />
              ))
            ) : (
              <p className="text-gray-400">No approved requests</p>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Rejected ({rejectedRequests.length})</h2>
          <div className="bg-black/30 rounded-xl border border-gray-800 p-4">
            {rejectedRequests.length > 0 ? (
              rejectedRequests.map(request => (
                <LeaveRequestCard 
                  key={request.id} 
                  request={request} 
                />
              ))
            ) : (
              <p className="text-gray-400">No rejected requests</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-gray-900 rounded-xl shadow-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">
                {actionType === 'approve' ? 'Approve' : 'Reject'} Leave Request
              </h2>
              <p className="text-gray-300 mb-4">
                Are you sure you want to {actionType === 'approve' ? 'approve' : 'reject'} this leave request?
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 ${
                    actionType === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white rounded-lg transition-colors`}
                >
                  {actionType === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default LeaveRequests;
