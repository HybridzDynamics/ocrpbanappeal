import React, { useState } from 'react';
import BanAppealForm from './components/BanAppealForm';
import AdminPanel from './components/AdminPanel';
import AppealStatus from './components/AppealStatus';
import { AppealData } from './types/Appeal';
import { Shield, Users, FileText } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'appeal' | 'status' | 'admin'>('appeal');
  const [appeals, setAppeals] = useState<AppealData[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAppealSubmit = (appealData: AppealData) => {
    const newAppeal = {
      ...appealData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending' as const
    };
    setAppeals(prev => [newAppeal, ...prev]);
  };

  const handleStatusUpdate = (id: string, status: 'approved' | 'denied', adminNotes?: string) => {
    setAppeals(prev => prev.map(appeal => 
      appeal.id === id 
        ? { ...appeal, status, adminNotes, reviewedAt: new Date().toISOString() }
        : appeal
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Orlando City RP</h1>
                <p className="text-sm text-slate-600">Ban Appeal System</p>
              </div>
            </div>
            <nav className="flex space-x-1">
              <button
                onClick={() => setActiveTab('appeal')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'appeal'
                    ? 'bg-blue-800 text-white shadow-md'
                    : 'text-slate-600 hover:text-blue-800 hover:bg-blue-50'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Submit Appeal
              </button>
              <button
                onClick={() => setActiveTab('status')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'status'
                    ? 'bg-blue-800 text-white shadow-md'
                    : 'text-slate-600 hover:text-blue-800 hover:bg-blue-50'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Check Status
              </button>
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setIsAdmin(!isAdmin);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'admin'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-orange-500 hover:bg-orange-50'
                }`}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                Admin
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'appeal' && (
          <BanAppealForm onSubmit={handleAppealSubmit} />
        )}
        {activeTab === 'status' && (
          <AppealStatus appeals={appeals} />
        )}
      </main>
    </div>
  );
}

export default App;