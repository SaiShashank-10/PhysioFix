import React, { useState } from 'react';

export default function PatientList({ patients, onReview }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredPatients = patients.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.injury.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-white">Patient Overview</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#18191d] text-white border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary w-64 placehoder-slate-500"
                    />
                    <div className="relative group">
                        <button className="bg-[#18191d] border border-white/10 rounded-lg p-2 hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-slate-400">filter_list</span>
                        </button>
                        {/* Simple filtering dropdown hover */}
                        <div className="absolute right-0 top-full mt-2 w-32 bg-[#18191d] border border-white/10 rounded-lg shadow-xl py-1 hidden group-hover:block z-20">
                            {['All', 'Critical', 'Recovering', 'On Track'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`w-full text-left px-4 py-2 text-xs hover:bg-white/5 ${filterStatus === status ? 'text-primary font-bold' : 'text-slate-400'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#18191d] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-slate-400 font-bold uppercase text-xs">
                        <tr>
                            <th className="p-4">Patient Name</th>
                            <th className="p-4">Condition</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Pain Level</th>
                            <th className="p-4">Compliance</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredPatients.map((p) => (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 font-bold max-w-[150px] truncate text-white">{p.name}</td>
                                <td className="p-4 text-slate-400">{p.injury}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${p.status === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                            p.status === 'Recovering' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                'bg-green-500/10 text-green-500 border-green-500/20'
                                        }`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`font-bold ${p.pain >= 7 ? 'text-red-500' : 'text-slate-300'}`}>{p.pain}/10</span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden w-20">
                                            <div style={{ width: p.compliance }} className={`h-full rounded-full ${parseInt(p.compliance) < 50 ? 'bg-red-500' : 'bg-primary'}`}></div>
                                        </div>
                                        <span className="text-xs text-slate-500">{p.compliance}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => onReview && onReview(p)}
                                        className="text-primary hover:text-white transition-colors text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100"
                                    >
                                        Review
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredPatients.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-slate-500 text-sm">
                                    No patients found matching "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
