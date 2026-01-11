import React from 'react';
import { db } from '../services/db';

const Footer: React.FC = () => {
  const settings = db.settings.get();

  return (
    <footer className="bg-slate-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        {/* Ads Section (Footer) */}
        {settings.enableAds && (
          <div className="mb-6 p-4 bg-slate-800 text-center rounded border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Sponsored Ad</p>
            <div className="h-16 flex items-center justify-center bg-slate-700 text-slate-300 font-mono text-sm">
              [Footer Ad Banner Placeholder]
            </div>
          </div>
        )}

        {/* Institution Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-bold text-blue-400 mb-2">{settings.institutionName}</h3>
            {settings.showAdminAddress && (
              <p className="text-sm text-slate-300">{settings.adminAddress}</p>
            )}
            {settings.showAdminMobile && (
              <p className="text-sm text-slate-300">Contact: +91 {settings.adminMobile}</p>
            )}
          </div>
          <div className="flex flex-col items-center md:items-end justify-center">
            <div className="text-xs text-slate-400">Secure Content Delivery System</div>
            <div className="text-xs text-slate-400">Version 1.0.0</div>
          </div>
        </div>

        {/* MANDATORY BRANDING - DO NOT REMOVE */}
        <div className="border-t border-slate-800 pt-6 text-center">
          <p className="font-semibold text-sm text-slate-400">Developed by maaZone</p>
          <p className="text-xs text-slate-500 mt-1 tracking-wider">we love CODE is secret</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
