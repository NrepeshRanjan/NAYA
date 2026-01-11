import React, { useState } from 'react';
import { db } from '../../../services/db';
import { Settings } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { Save, RefreshCw } from 'lucide-react';

const SystemSettings: React.FC = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState<Settings>(db.settings.get());
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        db.settings.update(settings, user?.id || 'admin');
        setTimeout(() => setLoading(false), 500);
    };

    const handleChange = (field: keyof Settings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">System Settings</h2>
                <button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded shadow hover:bg-slate-800 disabled:opacity-50"
                >
                    {loading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>

            {/* Branding Section */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">Branding & Logo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Institution Name</label>
                        <input type="text" className="w-full border p-2 rounded" value={settings.institutionName} onChange={e => handleChange('institutionName', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
                        <input type="text" className="w-full border p-2 rounded" placeholder="https://..." value={settings.logoUrl} onChange={e => handleChange('logoUrl', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Logo Placement</label>
                        <select className="w-full border p-2 rounded" value={settings.logoPlacement} onChange={e => handleChange('logoPlacement', e.target.value)}>
                            <option value="HEADER">Header Only</option>
                            <option value="FOOTER">Footer Only</option>
                            <option value="BOTH">Both</option>
                        </select>
                    </div>
                    <div className="flex items-center pt-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.showLogo ? 'bg-blue-600' : 'bg-slate-300'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${settings.showLogo ? 'translate-x-6' : ''}`}></div>
                            </div>
                            <span className="text-sm font-medium">Show Logo Globally</span>
                        </label>
                    </div>
                </div>
            </section>

            {/* Watermark Section */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">Security & Watermark</h3>
                <div className="mb-4">
                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.enableWatermark ? 'bg-green-600' : 'bg-slate-300'}`}>
                            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${settings.enableWatermark ? 'translate-x-6' : ''}`}></div>
                        </div>
                        <span className="text-sm font-medium">Enable PDF Watermarking</span>
                    </label>
                </div>
                {settings.enableWatermark && (
                    <div className="bg-slate-50 p-4 rounded border border-slate-200">
                        <p className="text-sm font-medium text-slate-700 mb-3">Include in Watermark:</p>
                        <div className="flex gap-4">
                            {['NAME', 'MOBILE', 'CLASS'].map((field) => (
                                <label key={field} className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={settings.watermarkFields.includes(field as any)}
                                        onChange={() => {
                                            const current = settings.watermarkFields;
                                            const updated = current.includes(field as any) 
                                                ? current.filter(f => f !== field)
                                                : [...current, field];
                                            handleChange('watermarkFields', updated);
                                        }}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm text-slate-600 capitalize">{field.toLowerCase()}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Ads Section */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">Monetization & Ads</h3>
                <div className="mb-4">
                     <label className="flex items-center gap-3 cursor-pointer mb-4">
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.enableAds ? 'bg-blue-600' : 'bg-slate-300'}`}>
                            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${settings.enableAds ? 'translate-x-6' : ''}`}></div>
                        </div>
                        <span className="text-sm font-medium">Enable Advertisements</span>
                    </label>
                </div>
                {settings.enableAds && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">AdMob Publisher ID / Script</label>
                            <textarea 
                                className="w-full border p-2 rounded h-24 font-mono text-sm" 
                                placeholder="<script>...</script>"
                                value={settings.adMobCode}
                                onChange={e => handleChange('adMobCode', e.target.value)}
                            ></textarea>
                        </div>
                        <p className="text-xs text-slate-400">Custom banner ads can be managed in the Content module via specialized 'Ad' content types if needed.</p>
                    </div>
                )}
            </section>

             {/* Footer Section */}
             <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">Contact Info (Footer)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Admin Address</label>
                        <input type="text" className="w-full border p-2 rounded" value={settings.adminAddress} onChange={e => handleChange('adminAddress', e.target.value)} />
                         <label className="flex items-center gap-2 cursor-pointer mt-2">
                            <input type="checkbox" checked={settings.showAdminAddress} onChange={e => handleChange('showAdminAddress', e.target.checked)} className="w-4 h-4" />
                            <span className="text-xs text-slate-500">Show in Footer</span>
                        </label>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Contact Mobile</label>
                        <input type="text" className="w-full border p-2 rounded" value={settings.adminMobile} onChange={e => handleChange('adminMobile', e.target.value)} />
                        <label className="flex items-center gap-2 cursor-pointer mt-2">
                            <input type="checkbox" checked={settings.showAdminMobile} onChange={e => handleChange('showAdminMobile', e.target.checked)} className="w-4 h-4" />
                            <span className="text-xs text-slate-500">Show in Footer</span>
                        </label>
                    </div>
                </div>
                <div className="mt-6 p-4 bg-slate-50 rounded text-center">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Locked Footer Branding</p>
                    <p className="text-sm font-mono text-slate-600">Developed by maaZone <br/> we love CODE is secret</p>
                </div>
            </section>
        </div>
    );
};

export default SystemSettings;
