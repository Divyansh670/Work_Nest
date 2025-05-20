
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

// Mock attendance data (In a real app, this would come from an API)
const mockAttendance = [
  { date: '2025-05-19', status: 'present', checkIn: '09:02 AM', checkOut: '06:08 PM' },
  { date: '2025-05-18', status: 'present', checkIn: '08:57 AM', checkOut: '06:15 PM' },
  { date: '2025-05-17', status: 'present', checkIn: '09:13 AM', checkOut: '05:58 PM' },
  { date: '2025-05-16', status: 'present', checkIn: '08:45 AM', checkOut: '06:30 PM' },
  { date: '2025-05-15', status: 'present', checkIn: '09:05 AM', checkOut: '06:12 PM' },
  { date: '2025-05-14', status: 'absent', checkIn: '-', checkOut: '-' },
  { date: '2025-05-13', status: 'present', checkIn: '08:50 AM', checkOut: '06:05 PM' },
  { date: '2025-05-12', status: 'present', checkIn: '09:10 AM', checkOut: '06:20 PM' },
  { date: '2025-05-11', status: 'weekend', checkIn: '-', checkOut: '-' },
  { date: '2025-05-10', status: 'weekend', checkIn: '-', checkOut: '-' },
];

const Attendance: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'employee') return null;
  
  // Calculate attendance metrics
  const totalWorkdays = mockAttendance.filter(a => a.status !== 'weekend').length;
  const presentDays = mockAttendance.filter(a => a.status === 'present').length;
  const absentDays = mockAttendance.filter(a => a.status === 'absent').length;
  const attendanceRate = Math.round((presentDays / totalWorkdays) * 100);
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
  
  // Check if already checked in today
  const todayAttendance = mockAttendance.find(a => a.date === today);
  const checkedInToday = todayAttendance && todayAttendance.status === 'present';
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">My Attendance</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-worknest-card-blue p-6 rounded-xl shadow-lg">
          <div className="text-4xl font-bold mb-2">{presentDays}</div>
          <div className="text-sm text-white/90">Days Present</div>
        </div>
        
        <div className="bg-worknest-card-red p-6 rounded-xl shadow-lg">
          <div className="text-4xl font-bold mb-2">{absentDays}</div>
          <div className="text-sm text-white/90">Days Absent</div>
        </div>
        
        <div className="bg-worknest-card-green p-6 rounded-xl shadow-lg">
          <div className="text-4xl font-bold mb-2">{attendanceRate}%</div>
          <div className="text-sm text-white/90">Attendance Rate</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-black/30 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Attendance History</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/30">
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Check In</th>
                    <th className="py-3 px-4 font-medium">Check Out</th>
                    <th className="py-3 px-4 font-medium">Work Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAttendance.map((record) => {
                    // Calculate work hours (only for present days)
                    let workHours = '-';
                    if (record.status === 'present' && record.checkIn !== '-' && record.checkOut !== '-') {
                      const checkIn = new Date(`2023-01-01 ${record.checkIn}`);
                      const checkOut = new Date(`2023-01-01 ${record.checkOut}`);
                      const diffHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
                      workHours = `${Math.floor(diffHours)}h ${Math.round((diffHours % 1) * 60)}m`;
                    }
                    
                    return (
                      <tr key={record.date} className="border-t border-gray-800 hover:bg-black/20">
                        <td className="py-3 px-4">
                          {new Date(record.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`
                            px-2 py-1 text-xs rounded-full
                            ${record.status === 'present' ? 'bg-green-900/30 text-green-400' : ''}
                            ${record.status === 'absent' ? 'bg-red-900/30 text-red-400' : ''}
                            ${record.status === 'weekend' ? 'bg-gray-900/30 text-gray-400' : ''}
                          `}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">{record.checkIn}</td>
                        <td className="py-3 px-4">{record.checkOut}</td>
                        <td className="py-3 px-4">{workHours}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-black/30 rounded-xl border border-gray-800 p-6">
            <h3 className="font-medium mb-4">Today's Status</h3>
            
            {isWeekend ? (
              <div className="bg-yellow-900/20 text-yellow-400 p-4 rounded-lg mb-4">
                <p className="font-medium">Weekend</p>
                <p className="text-sm mt-1">Enjoy your time off!</p>
              </div>
            ) : checkedInToday ? (
              <div className="bg-green-900/20 text-green-400 p-4 rounded-lg mb-4">
                <p className="font-medium">Checked In</p>
                <p className="text-sm mt-1">You checked in at {todayAttendance?.checkIn}</p>
                {todayAttendance?.checkOut !== '-' && (
                  <p className="text-sm mt-1">You checked out at {todayAttendance?.checkOut}</p>
                )}
              </div>
            ) : (
              <div className="bg-gray-800/40 p-4 rounded-lg mb-4">
                <p className="font-medium">Not Checked In</p>
                <p className="text-sm mt-1">You haven't checked in today.</p>
              </div>
            )}
            
            <div className="mt-4">
              <button
                className="w-full px-4 py-3 bg-worknest-primary hover:bg-opacity-90 text-white rounded-lg transition-colors mb-3"
                disabled={checkedInToday}
              >
                {checkedInToday ? 'Already Checked In' : 'Check In'}
              </button>
              
              <button
                className="w-full px-4 py-3 bg-amber-600 hover:bg-opacity-90 text-white rounded-lg transition-colors"
                disabled={!checkedInToday || todayAttendance?.checkOut !== '-'}
              >
                {todayAttendance?.checkOut !== '-' ? 'Already Checked Out' : 'Check Out'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
