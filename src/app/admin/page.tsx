import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import React from 'react';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  await dbConnect();
  
  const totalUsers = await User.countDocuments();
  const academicUsers = await User.countDocuments({ isAcademic: true });

  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const progressPercentage = Math.min((academicUsers / 42) * 100, 100);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 p-8 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 border-b border-slate-800 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Veritus <span className="text-cyan-400">Analytics</span></h1>
            <p className="text-slate-400">Hackathon Goal Tracking Dashboard</p>
          </div>
          <div className="text-right">
             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Target</div>
             <div className="text-2xl font-bold text-emerald-400">42 Academic Users</div>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Users */}
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Total Users</h3>
            <div className="text-5xl font-bold text-white">{totalUsers}</div>
            <div className="mt-2 text-xs text-slate-500">All registered emails</div>
          </div>

          {/* Academic Users */}
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden bg-cyan-950/20 border-cyan-500/30">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-cyan-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10v6"/><path d="M20 10a10 10 0 1 0-16 0"/><path d="M12 4v6"/></svg>
            </div>
            <h3 className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-2">Academic Users</h3>
            <div className="text-5xl font-bold text-white">{academicUsers}</div>
            <div className="w-full bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
               <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }} />
            </div>
            <div className="mt-2 text-xs text-cyan-300 flex justify-between">
              <span>{progressPercentage.toFixed(0)}% to goal</span>
              <span>{42 - academicUsers} more needed</span>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            </div>
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Academic Rate</h3>
            <div className="text-5xl font-bold text-white">
              {totalUsers > 0 ? ((academicUsers / totalUsers) * 100).toFixed(1) : 0}%
            </div>
            <div className="mt-2 text-xs text-slate-500">Ratio of academic vs total</div>
          </div>
        </div>

        {/* User Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-900/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-200">Recent Signups</h3>
            <span className="text-xs text-slate-500">Last 50 users</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-900/80 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Domain</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentUsers.map((user: any) => (
                  <tr key={user._id.toString()} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-300">{user.email}</td>
                    <td className="px-6 py-4">{user.domain}</td>
                    <td className="px-6 py-4">
                      {user.isAcademic ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-emerald-950/50 text-emerald-400 border border-emerald-500/20">
                          ACADEMIC
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-slate-800 text-slate-400">
                          STANDARD
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{new Date(user.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                
                {recentUsers.length === 0 && (
                   <tr>
                     <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                       No users found yet.
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
