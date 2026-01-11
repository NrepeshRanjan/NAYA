import React, { useState } from 'react';
import { db } from '../../services/db';
import { Users, BookOpen, Settings as SettingsIcon, DollarSign, Activity, FileText, BarChart, ShieldAlert } from 'lucide-react';
import { User, Role } from '../../types';

const AdminDashboard: React.FC = () => {
  const users = db.users.getAll();
  const content = db.content.getAll();
  const settings = db.settings.get();

  const [activeTab, setActiveTab] = useState<'users' | 'content' | 'settings'>('users');

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Content', value: content.length, icon: FileText, color: 'bg-green-500' },
    { label: 'Revenue', value: '₹ 45k', icon: DollarSign, color: 'bg-yellow-500' },
    { label: 'Active Students', value: users.filter(u => u.role === Role.STUDENT && u.isPaid).length, icon: Activity, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white shadow-md`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-100 p-4 h-fit">
          <h2 className="font-bold text-lg text-slate-800 mb-4 px-2">Admin Controls</h2>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'users' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Users size={18} />
              User Management
            </button>
            <button 
              onClick={() => setActiveTab('content')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'content' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <BookOpen size={18} />
              Content & Files
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'settings' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <SettingsIcon size={18} />
              System Settings
            </button>
             <button 
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors text-slate-600 hover:bg-slate-50`}
            >
              <ShieldAlert size={18} />
              Audit Logs
            </button>
          </div>
        </div>

        {/* Main Panel */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          {activeTab === 'users' && (
            <div>
              <h3 className="font-bold text-lg mb-4">User Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Class</th>
                      <th className="p-3">Paid?</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="p-3 font-medium text-slate-800">{u.name}<br/><span className="text-xs text-slate-400">{u.email}</span></td>
                        <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === Role.ADMIN ? 'bg-purple-100 text-purple-700' : u.role === Role.TEACHER ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                {u.role}
                            </span>
                        </td>
                        <td className="p-3">{u.classGrade || '-'}</td>
                        <td className="p-3">
                            {u.role === Role.STUDENT && (
                                u.isPaid 
                                ? <span className="text-green-600 font-semibold">Yes</span> 
                                : <span className="text-red-500 font-semibold">No</span>
                            )}
                        </td>
                        <td className="p-3">
                            <button className="text-blue-600 hover:underline text-xs mr-2">Edit</button>
                            {u.role === Role.STUDENT && !u.isPaid && (
                                <button className="text-green-600 hover:underline text-xs">Verify Pay</button>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
               <h3 className="font-bold text-lg mb-4">System Settings</h3>
               <div className="space-y-6">
                   {/* Visibility Toggles */}
                   <div className="p-4 bg-slate-50 rounded border border-slate-200">
                       <h4 className="font-semibold text-slate-700 mb-3">Visibility Controls</h4>
                       <div className="flex items-center justify-between mb-3">
                           <span className="text-sm text-slate-600">Show Admin Mobile</span>
                           <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.showAdminMobile ? 'bg-blue-600' : 'bg-slate-300'}`}>
                               <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${settings.showAdminMobile ? 'translate-x-4' : ''}`}></div>
                           </div>
                       </div>
                       <div className="flex items-center justify-between">
                           <span className="text-sm text-slate-600">Show Admin Address</span>
                            <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.showAdminAddress ? 'bg-blue-600' : 'bg-slate-300'}`}>
                               <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${settings.showAdminAddress ? 'translate-x-4' : ''}`}></div>
                           </div>
                       </div>
                   </div>

                   {/* Watermark Config */}
                   <div className="p-4 bg-slate-50 rounded border border-slate-200">
                       <h4 className="font-semibold text-slate-700 mb-3">Security & Watermark</h4>
                       <div className="flex items-center justify-between mb-3">
                           <span className="text-sm text-slate-600">Enable Watermark on Downloads</span>
                           <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.enableWatermark ? 'bg-green-600' : 'bg-slate-300'}`}>
                               <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${settings.enableWatermark ? 'translate-x-4' : ''}`}></div>
                           </div>
                       </div>
                       <p className="text-xs text-slate-400">If enabled, student ID and IP will be stamped on PDFs.</p>
                   </div>
               </div>
            </div>
          )}

           {activeTab === 'content' && (
             <div className="text-center py-10 text-slate-500">
                 <BookOpen size={48} className="mx-auto mb-2 opacity-20" />
                 <p>Content Management Module Loaded.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
