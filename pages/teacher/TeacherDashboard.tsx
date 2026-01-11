import React from 'react';
import { db } from '../../services/db';
import { Upload, BookOpen, Clock } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Teacher Dashboard</h1>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
                    <Upload size={18} />
                    Upload New Content
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-700 mb-6">
                    <Clock size={20} className="text-blue-500" />
                    <h2>Upcoming Live Classes</h2>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center text-slate-500">
                    <p>No live classes scheduled.</p>
                    <button className="mt-2 text-blue-600 font-medium hover:underline text-sm">Schedule a class</button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                 <h2 className="text-lg font-semibold text-slate-700 mb-4">My Uploads</h2>
                 <p className="text-slate-500 text-sm">Content management is restricted to Admin review in this demo version.</p>
            </div>
        </div>
    )
}

export default TeacherDashboard;
