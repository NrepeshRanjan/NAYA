import React from 'react';
import { db } from '../../../services/db';
import { Users, DollarSign, Activity, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { Role } from '../../../types';

const Overview: React.FC = () => {
  const users = db.users.getAll();
  const content = db.content.getAll();
  const logs = db.audit.getAll().slice(0, 5); // Last 5 logs
  
  const students = users.filter(u => u.role === Role.STUDENT);
  const paidStudents = students.filter(u => u.isPaid);
  const revenue = paidStudents.reduce((acc, curr) => {
      // Approximate revenue based on subscription type
      const amount = curr.subscriptionType === 'OVERALL' ? 2000 : 500;
      return acc + amount;
  }, 0);

  const stats = [
    { label: 'Total Revenue', value: `₹ ${revenue.toLocaleString()}`, icon: DollarSign, color: 'bg-yellow-500', trend: '+12% this month' },
    { label: 'Active Students', value: paidStudents.length, icon: Activity, color: 'bg-green-500', trend: `${paidStudents.length} active now` },
    { label: 'Total Users', value: users.length, icon: Users, color: 'bg-blue-500', trend: 'Including staff' },
    { label: 'Content Files', value: content.length, icon: FileText, color: 'bg-purple-500', trend: 'Docs, Videos, PDFs' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 transition-transform hover:scale-[1.01]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              </div>
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-white shadow-sm`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-slate-500">
                <TrendingUp size={14} className="mr-1 text-green-500" />
                {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity Log */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold text-lg text-slate-800 mb-4">Recent Audit Logs</h3>
              <div className="space-y-4">
                  {logs.length > 0 ? logs.map(log => (
                      <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                          <div className="mt-1">
                             <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                          </div>
                          <div>
                              <p className="text-sm font-medium text-slate-700">{log.action}</p>
                              <p className="text-xs text-slate-500">{log.details}</p>
                              <p className="text-[10px] text-slate-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                          </div>
                      </div>
                  )) : (
                      <p className="text-sm text-slate-400 italic">No activity recorded yet.</p>
                  )}
              </div>
          </div>

          {/* Pending Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold text-lg text-slate-800 mb-4">Pending Actions</h3>
              <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3">
                      <AlertTriangle className="text-red-500" size={18} />
                      <div>
                          <p className="text-sm font-bold text-red-700">3 Payment Issues</p>
                          <p className="text-xs text-red-500">Users reported failure</p>
                      </div>
                  </div>
                   <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
                      <Users className="text-blue-500" size={18} />
                      <div>
                          <p className="text-sm font-bold text-blue-700">{users.length - students.length} Staff Members</p>
                          <p className="text-xs text-blue-500">Active accounts</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Overview;
