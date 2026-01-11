import React, { useState } from 'react';
import { db } from '../../../services/db';
import { User, Role, SubscriptionType } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { Search, Edit2, Lock, Unlock, Trash2, Plus, X } from 'lucide-react';

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(db.users.getAll());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleRefresh = () => {
      setUsers(db.users.getAll());
      setEditingUser(null);
  };

  const filteredUsers = users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'ALL' || u.role === filterRole;
      return matchesSearch && matchesRole;
  });

  const handleBlockToggle = (u: User) => {
      if (confirm(`Are you sure you want to ${u.isBlocked ? 'unblock' : 'block'} ${u.name}?`)) {
          db.users.update(u.id, { isBlocked: !u.isBlocked }, currentUser?.id);
          handleRefresh();
      }
  };

  const handleDelete = (id: string) => {
      if (confirm('Are you sure? This action cannot be undone.')) {
          db.users.delete(id, currentUser?.id || 'admin');
          handleRefresh();
      }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingUser) return;
      
      // Separate update logic
      // In a real app we would pick only changed fields
      db.users.update(editingUser.id, {
          name: editingUser.name,
          role: editingUser.role,
          classGrade: editingUser.classGrade,
          subscriptionType: editingUser.subscriptionType,
          isPaid: editingUser.isPaid
      }, currentUser?.id);
      
      handleRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800">User Management</h2>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 text-sm">
                <Plus size={16} /> Add User
            </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                  type="text" 
                  placeholder="Search by name or email..." 
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          <select 
              className="px-4 py-2 border border-slate-300 rounded outline-none"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
          >
              <option value="ALL">All Roles</option>
              <option value={Role.STUDENT}>Students</option>
              <option value={Role.TEACHER}>Teachers</option>
              <option value={Role.ADMIN}>Admins</option>
          </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                    <th className="p-4">User Details</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Subscription</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                        <p className="font-semibold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                        <p className="text-xs text-slate-500">{u.mobile}</p>
                    </td>
                    <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                            ${u.role === Role.ADMIN ? 'bg-purple-100 text-purple-700' : 
                            u.role === Role.TEACHER ? 'bg-orange-100 text-orange-700' : 
                            'bg-blue-100 text-blue-700'}`}>
                            {u.role}
                        </span>
                    </td>
                    <td className="p-4">
                        {u.role === Role.STUDENT ? (
                            <div className="space-y-1">
                                <p className="text-slate-700 font-medium">Class {u.classGrade}</p>
                                <p className="text-xs text-slate-500">{u.subscriptionType === SubscriptionType.OVERALL ? 'Overall' : 'Subject Wise'}</p>
                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${u.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {u.isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                            </div>
                        ) : (
                            <span className="text-slate-400">-</span>
                        )}
                    </td>
                    <td className="p-4">
                        {u.isBlocked ? (
                            <span className="text-red-600 flex items-center gap-1 font-medium"><Lock size={12}/> Blocked</span>
                        ) : (
                            <span className="text-green-600 flex items-center gap-1 font-medium"><Unlock size={12}/> Active</span>
                        )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                        <button onClick={() => setEditingUser(u)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                            <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleBlockToggle(u)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded" title={u.isBlocked ? "Unblock" : "Block"}>
                            {u.isBlocked ? <Unlock size={16} /> : <Lock size={16} />}
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                            <Trash2 size={16} />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <h3 className="font-bold text-slate-800">Edit User</h3>
                      <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                          <X size={20} />
                      </button>
                  </div>
                  <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                          <input 
                              type="text" 
                              value={editingUser.name} 
                              onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                              className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                              <select 
                                  value={editingUser.role} 
                                  onChange={e => setEditingUser({...editingUser, role: e.target.value as Role})}
                                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                              >
                                  <option value={Role.STUDENT}>Student</option>
                                  <option value={Role.TEACHER}>Teacher</option>
                                  <option value={Role.ADMIN}>Admin</option>
                              </select>
                          </div>
                          {editingUser.role === Role.STUDENT && (
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                                  <select 
                                      value={editingUser.classGrade} 
                                      onChange={e => setEditingUser({...editingUser, classGrade: e.target.value})}
                                      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                  >
                                      <option value="9">Class 9</option>
                                      <option value="10">Class 10</option>
                                      <option value="11">Class 11</option>
                                      <option value="12">Class 12</option>
                                  </select>
                              </div>
                          )}
                      </div>

                      {editingUser.role === Role.STUDENT && (
                          <div className="p-4 bg-yellow-50 rounded border border-yellow-100 space-y-3">
                              <h4 className="font-semibold text-yellow-800 text-sm">Subscription Control</h4>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-medium text-yellow-700 mb-1">Plan</label>
                                      <select 
                                          value={editingUser.subscriptionType} 
                                          onChange={e => setEditingUser({...editingUser, subscriptionType: e.target.value as SubscriptionType})}
                                          className="w-full px-2 py-1 text-sm border border-yellow-300 rounded bg-white"
                                      >
                                          <option value={SubscriptionType.CLASS_WISE}>Class Wise</option>
                                          <option value={SubscriptionType.OVERALL}>Overall</option>
                                      </select>
                                  </div>
                                  <div className="flex items-center pt-5">
                                      <label className="flex items-center gap-2 cursor-pointer">
                                          <input 
                                              type="checkbox" 
                                              checked={editingUser.isPaid} 
                                              onChange={e => setEditingUser({...editingUser, isPaid: e.target.checked})}
                                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                                          />
                                          <span className="text-sm font-medium text-slate-700">Payment Verified</span>
                                      </label>
                                  </div>
                              </div>
                          </div>
                      )}
                      
                      <div className="pt-4 flex justify-end gap-3">
                          <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Changes</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default UserManagement;
