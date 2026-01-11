import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/db';
import { AlertTriangle, Lock, Download, PlayCircle, FileText, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  // Payment Wall
  if (!user.isPaid) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-orange-200">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Subscription Pending</h1>
          <p className="text-slate-600 mb-6">
            You are signed up for <strong>Class {user.classGrade} ({user.subscriptionType})</strong>. 
            Please complete your payment to access the study materials.
          </p>
          
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-left mb-6">
             <h3 className="font-bold text-slate-700 mb-2">Payment Details</h3>
             <p className="text-sm text-slate-600 mb-1">Amount Due: <span className="font-bold text-slate-900">₹ {user.subscriptionType === 'OVERALL' ? '2000' : '500'}</span></p>
             <p className="text-sm text-slate-600">Method: UPI (Razorpay)</p>
          </div>

          <button 
             onClick={() => {
                 // Simulate Payment Success
                 // In real app, this opens Razorpay
                 db.users.update(user.id, { isPaid: true });
                 window.location.reload(); // Refresh to clear gate
             }}
             className="px-8 py-3 bg-green-600 text-white font-bold rounded shadow-lg hover:bg-green-700 transition-transform active:scale-95"
          >
            Pay Now Securely
          </button>
        </div>
      </div>
    );
  }

  // Access Granted Content
  const classContent = db.content.getByClass(user.classGrade || '10');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Classroom</h1>
          <p className="text-slate-500">Class {user.classGrade} • {user.subscriptionType === 'OVERALL' ? 'All Subjects' : 'Physics Only'}</p>
        </div>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-600"></span>
            Active Subscription
        </div>
      </div>

      {/* Ads Section (Content) */}
      <div className="w-full h-24 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 border border-slate-300 border-dashed">
          Google AdMob Banner
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classContent.length > 0 ? (
            classContent.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-32 bg-slate-100 flex items-center justify-center text-slate-400">
                        {item.type === 'VIDEO' ? <PlayCircle size={40} /> : <FileText size={40} />}
                    </div>
                    <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{item.subject}</span>
                            <span className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-slate-500 mb-4">{item.chapter}</p>
                        
                        <button className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-2 rounded text-sm hover:bg-slate-900 transition-colors">
                            <Download size={16} />
                            Download {item.isWatermarked ? '(Watermarked)' : ''}
                        </button>
                    </div>
                </div>
            ))
        ) : (
            <div className="col-span-full py-12 text-center text-slate-500">
                <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                <p>No content uploaded for this class yet.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;