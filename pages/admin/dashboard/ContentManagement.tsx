import React, { useState } from 'react';
import { db } from '../../../services/db';
import { Content, ContentType } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { Upload, Trash2, Eye, EyeOff, FileText, Video, Image as ImageIcon, Link as LinkIcon, Download } from 'lucide-react';

const ContentManagement: React.FC = () => {
    const { user } = useAuth();
    const [contents, setContents] = useState<Content[]>(db.content.getAll());
    const [isUploadMode, setIsUploadMode] = useState(false);
    
    // Upload Form State
    const [newItem, setNewItem] = useState<Partial<Content>>({
        title: '',
        type: ContentType.PDF,
        classGrade: '10',
        subject: 'Physics',
        chapter: '',
        url: '', // Simulated
        isWatermarked: true,
        isVisible: true,
        isDownloadable: true
    });

    const handleRefresh = () => setContents(db.content.getAll());

    const handleDelete = (id: string) => {
        if (confirm('Delete this content permanently?')) {
            db.content.delete(id, user?.id || 'admin');
            handleRefresh();
        }
    };

    const handleToggleVisibility = (item: Content) => {
        db.content.update(item.id, { isVisible: !item.isVisible }, user?.id || 'admin');
        handleRefresh();
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        const content: Content = {
            id: `content-${Date.now()}`,
            ...newItem as any,
            uploadedBy: user?.id,
            createdAt: Date.now(),
            views: 0,
            downloads: 0
        };
        db.content.create(content, user?.id || 'admin');
        setIsUploadMode(false);
        handleRefresh();
        // Reset form
        setNewItem({
            title: '',
            type: ContentType.PDF,
            classGrade: '10',
            subject: 'Physics',
            chapter: '',
            url: '',
            isWatermarked: true,
            isVisible: true,
            isDownloadable: true
        });
    };

    const getTypeIcon = (type: ContentType) => {
        switch(type) {
            case ContentType.VIDEO: return <Video size={18} className="text-red-500" />;
            case ContentType.IMAGE: return <ImageIcon size={18} className="text-purple-500" />;
            case ContentType.LINK: return <LinkIcon size={18} className="text-blue-500" />;
            default: return <FileText size={18} className="text-slate-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Content Library</h2>
                <button 
                    onClick={() => setIsUploadMode(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                >
                    <Upload size={18} /> Upload New
                </button>
            </div>

            {/* Upload Modal */}
            {isUploadMode && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Upload Content</h3>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                    <input required type="text" className="w-full border p-2 rounded" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                        <select className="w-full border p-2 rounded" value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value as ContentType})}>
                                            {Object.values(ContentType).map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                                        <select className="w-full border p-2 rounded" value={newItem.classGrade} onChange={e => setNewItem({...newItem, classGrade: e.target.value})}>
                                            {['9', '10', '11', '12'].map(c => <option key={c} value={c}>Class {c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                        <input required type="text" className="w-full border p-2 rounded" value={newItem.subject} onChange={e => setNewItem({...newItem, subject: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Chapter</label>
                                        <input required type="text" className="w-full border p-2 rounded" value={newItem.chapter} onChange={e => setNewItem({...newItem, chapter: e.target.value})} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">File URL / Link</label>
                                    <input required type="text" className="w-full border p-2 rounded" placeholder="https://..." value={newItem.url} onChange={e => setNewItem({...newItem, url: e.target.value})} />
                                </div>

                                <div className="flex gap-6 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={newItem.isWatermarked} onChange={e => setNewItem({...newItem, isWatermarked: e.target.checked})} className="w-4 h-4" />
                                        <span className="text-sm">Apply Watermark</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={newItem.isDownloadable} onChange={e => setNewItem({...newItem, isDownloadable: e.target.checked})} className="w-4 h-4" />
                                        <span className="text-sm">Allow Download</span>
                                    </label>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button type="button" onClick={() => setIsUploadMode(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Upload</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Content List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="p-4">Content</th>
                            <th className="p-4">Class/Subject</th>
                            <th className="p-4">Attributes</th>
                            <th className="p-4">Stats</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {contents.map(item => (
                            <tr key={item.id} className={`hover:bg-slate-50 ${!item.isVisible ? 'opacity-60 bg-slate-50' : ''}`}>
                                <td className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">{getTypeIcon(item.type)}</div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{item.title}</p>
                                            <p className="text-xs text-slate-500">{item.chapter}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="block font-medium">Class {item.classGrade}</span>
                                    <span className="text-xs text-slate-500">{item.subject}</span>
                                </td>
                                <td className="p-4 space-y-1">
                                    {item.isWatermarked && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded block w-fit">Watermarked</span>}
                                    {item.isDownloadable ? (
                                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded block w-fit">Downloadable</span>
                                    ) : (
                                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded block w-fit">No Download</span>
                                    )}
                                </td>
                                <td className="p-4 text-xs text-slate-500">
                                    <p>{item.views} Views</p>
                                    <p>{item.downloads} Downloads</p>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button onClick={() => handleToggleVisibility(item)} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded" title="Toggle Visibility">
                                        {item.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContentManagement;
