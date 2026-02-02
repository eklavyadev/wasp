'use client';

import { useState, useEffect } from 'react';

/* ---------- TYPES ---------- */
type Report = {
  id: string;
  image_url: string;
  location: string;
  landmark: string;
  lat: number;
  lng: number;
  type: string;
  impact_level: number;
  governing_body: string;
  status: 'pending' | 'approved' | 'rejected' | 'resolved';
  created_at: string;
};

const IMPACT_BADGE: Record<number, string> = {
  1: 'bg-green-600/20 text-green-400 border-green-600/50',
  2: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  3: 'bg-red-600/20 text-red-400 border-red-600/50',
};

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<Report['status']>('pending');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const login = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuth(true);
      fetchReports();
    } else {
      showToast('❌ Access Denied');
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reports');
      const data = await res.json();
      setReports(data);
    } catch (err) {
      showToast('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Report['status']) => {
    try {
      const res = await fetch('/api/admin/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      
      setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      showToast(`Signal marked as ${status}`);
    } catch (err) {
      showToast('Update failed');
    }
  };

  const deleteReport = async (id: string) => {
    const ok = confirm('This will permanently delete this report from the database. Continue?');
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== id));
        showToast('🗑 Report permanently deleted');
      } else {
        throw new Error();
      }
    } catch (err) {
      showToast('❌ Delete failed');
    }
  };

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020817] p-6">
        <div className="border border-slate-800 p-8 rounded-2xl w-full max-w-md bg-[#0f172a] shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-white tracking-tight text-center text-teal-500">WASP Command</h2>
          <input
            type="password"
            placeholder="Security Token"
            className="border border-slate-700 bg-[#020817] text-white p-4 w-full mb-4 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
          />
          <button onClick={login} className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-teal-500 transition-colors">Authorize Access</button>
        </div>
      </div>
    );
  }

  const filteredReports = reports.filter(r => r.status === activeTab);

  return (
    <div className="p-8 bg-[#020817] min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Incident Control</h1>
            <p className="text-slate-500 text-sm">Managing urban resilience signals for Guwahati</p>
          </div>
          <button onClick={fetchReports} className="text-xs bg-slate-800 px-4 py-2 rounded-full border border-slate-700 hover:bg-slate-700 transition-all active:scale-95">
            {loading ? 'Syncing...' : 'Refresh Feed'}
          </button>
        </header>

        {/* Tabs with Counts */}
        <div className="flex gap-2 mb-8 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800 w-fit">
          {['pending', 'approved', 'resolved', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2.5 rounded-lg capitalize text-sm font-bold transition-all ${
                activeTab === tab ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab} ({reports.filter(r => r.status === tab).length})
            </button>
          ))}
        </div>

        {filteredReports.length === 0 ? (
          <div className="border-2 border-dashed border-slate-800 rounded-3xl p-20 text-center">
            <p className="text-slate-500">Queue Clear. No {activeTab} signals detected.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((r) => (
              <div key={r.id} className="border border-slate-800 rounded-2xl bg-[#0f172a] overflow-hidden flex flex-col group hover:border-teal-500/50 transition-all">
                <div className="relative h-56 bg-black">
                  <img src={r.image_url} alt="Incident Evidence" className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${IMPACT_BADGE[r.impact_level]}`}>
                    Level {r.impact_level}
                  </div>
                </div>

                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-teal-400 text-lg">{r.type}</h3>
                    <span className="text-[10px] font-mono text-slate-500">{new Date(r.created_at).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex gap-2 italic text-slate-300 bg-slate-800/50 p-2 rounded-lg text-sm">
                    <span className="text-teal-500">📍</span>
                    <p className="leading-tight">{r.landmark || r.location}</p>
                  </div>
                </div>

                {/* Dynamic Action Bar */}
                <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex flex-col gap-2">
                  {activeTab === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(r.id, 'approved')} className="flex-1 bg-teal-600 hover:bg-teal-500 py-2 rounded-lg text-xs font-bold transition-colors">Approve</button>
                      <button onClick={() => updateStatus(r.id, 'rejected')} className="flex-1 bg-slate-800 hover:bg-red-900 py-2 rounded-lg text-xs font-bold border border-slate-700">Reject</button>
                    </div>
                  )}

                  {activeTab === 'approved' && (
                    <button onClick={() => updateStatus(r.id, 'resolved')} className="w-full bg-white text-black hover:bg-teal-400 py-2 rounded-lg text-xs font-black uppercase tracking-tighter transition-all">Mark as Resolved</button>
                  )}

                  {activeTab === 'rejected' && (
                    <div className="flex flex-col gap-2">
                      <button onClick={() => updateStatus(r.id, 'pending')} className="w-full border border-slate-700 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800">Restore to Pending</button>
                      <button 
                        onClick={() => deleteReport(r.id)} 
                        className="w-full bg-red-900/20 border border-red-900/50 text-red-400 hover:bg-red-600 hover:text-white py-2 rounded-lg text-xs font-bold transition-all"
                      >
                        🗑 Delete Permanently
                      </button>
                    </div>
                  )}

                  {activeTab === 'resolved' && (
                    <button onClick={() => updateStatus(r.id, 'pending')} className="w-full border border-slate-700 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800">Restore to Pending</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-teal-500 text-black px-6 py-3 rounded-full shadow-2xl font-bold animate-bounce text-sm z-50">
          {toast}
        </div>
      )}
    </div>
  );
}