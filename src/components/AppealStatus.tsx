import React, { useState } from 'react';
import { AppealData } from '../types/Appeal';
import { Search, Clock, CheckCircle, XCircle, Calendar, User, MessageSquare } from 'lucide-react';

interface AppealStatusProps {
  appeals: AppealData[];
}

const AppealStatus: React.FC<AppealStatusProps> = ({ appeals }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAppeals = appeals.filter(appeal =>
    appeal.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appeal.discordTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appeal.id?.includes(searchQuery)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'denied':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'denied':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">Appeal Status</h1>
          <p className="text-blue-100 mt-2">Track the status of submitted ban appeals</p>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by player name, Discord tag, or appeal ID..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
          </div>

          {filteredAppeals.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No Appeals Found</h3>
              <p className="text-slate-600">
                {searchQuery ? 'No appeals match your search criteria.' : 'No ban appeals have been submitted yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppeals.map((appeal) => (
                <div key={appeal.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-800" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{appeal.playerName}</h3>
                        <p className="text-sm text-slate-600">Appeal ID: #{appeal.id}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center space-x-1 ${getStatusColor(appeal.status || 'pending')}`}>
                      {getStatusIcon(appeal.status || 'pending')}
                      <span className="capitalize">{appeal.status || 'pending'}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">Discord: <span className="text-slate-900 font-medium">{appeal.discordTag}</span></p>
                      <p className="text-slate-600">Steam ID: <span className="text-slate-900 font-medium">{appeal.steamId}</span></p>
                    </div>
                    <div>
                      <p className="text-slate-600">Submitted: <span className="text-slate-900 font-medium">{formatDate(appeal.submittedAt || '')}</span></p>
                      {appeal.reviewedAt && (
                        <p className="text-slate-600">Reviewed: <span className="text-slate-900 font-medium">{formatDate(appeal.reviewedAt)}</span></p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600 mb-2">Ban Reason:</p>
                    <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{appeal.banReason}</p>
                  </div>

                  {appeal.adminNotes && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-sm text-slate-600 mb-2">Admin Notes:</p>
                      <p className="text-slate-900 bg-blue-50 p-3 rounded-lg border border-blue-200">{appeal.adminNotes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppealStatus;