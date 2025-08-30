import React, { useState } from 'react';
import { AppealData } from '../types/Appeal';
import { Shield, Eye, Check, X, MessageSquare, Calendar, User, ExternalLink } from 'lucide-react';

interface AdminPanelProps {
  appeals: AppealData[];
  onStatusUpdate: (id: string, status: 'approved' | 'denied', adminNotes?: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ appeals, onStatusUpdate }) => {
  const [selectedAppeal, setSelectedAppeal] = useState<AppealData | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'denied'>('pending');

  const filteredAppeals = appeals.filter(appeal => {
    if (filter === 'all') return true;
    return appeal.status === filter;
  });

  const handleApprove = () => {
    if (selectedAppeal) {
      onStatusUpdate(selectedAppeal.id!, 'approved', adminNotes);
      setSelectedAppeal(null);
      setAdminNotes('');
    }
  };

  const handleDeny = () => {
    if (selectedAppeal) {
      onStatusUpdate(selectedAppeal.id!, 'denied', adminNotes);
      setSelectedAppeal(null);
      setAdminNotes('');
    }
  };

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
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-orange-100 mt-1">Review and manage ban appeals</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {(['all', 'pending', 'approved', 'denied'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize ${
                  filter === status
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status} ({appeals.filter(a => status === 'all' || a.status === status).length})
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {filteredAppeals.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Appeals</h3>
                    <p className="text-slate-600">No appeals found for the selected filter.</p>
                  </div>
                ) : (
                  filteredAppeals.map((appeal) => (
                    <div
                      key={appeal.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedAppeal?.id === appeal.id
                          ? 'border-orange-300 bg-orange-50 shadow-md'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setSelectedAppeal(appeal)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-800" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{appeal.playerName}</h3>
                            <p className="text-sm text-slate-600">#{appeal.id}</p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(appeal.status || 'pending')}`}>
                          {appeal.status || 'pending'}
                        </div>
                      </div>
                      
                      <div className="text-sm text-slate-600">
                        <p>Discord: {appeal.discordTag}</p>
                        <p>Submitted: {formatDate(appeal.submittedAt || '')}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              {selectedAppeal ? (
                <div className="bg-slate-50 rounded-lg p-6 sticky top-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Eye className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-slate-900">Appeal Details</h3>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">Player Information</p>
                      <div className="bg-white p-3 rounded border text-sm">
                        <p><strong>Name:</strong> {selectedAppeal.playerName}</p>
                        <p><strong>Discord:</strong> {selectedAppeal.discordTag}</p>
                        <p><strong>Steam ID:</strong> {selectedAppeal.steamId}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">Ban Information</p>
                      <div className="bg-white p-3 rounded border text-sm">
                        <p><strong>Date:</strong> {selectedAppeal.banDate}</p>
                        <p><strong>Reason:</strong> {selectedAppeal.banReason}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">Appeal Reason</p>
                      <div className="bg-white p-3 rounded border text-sm max-h-32 overflow-y-auto">
                        {selectedAppeal.appealReason}
                      </div>
                    </div>

                    {selectedAppeal.additionalInfo && (
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Additional Info</p>
                        <div className="bg-white p-3 rounded border text-sm max-h-24 overflow-y-auto">
                          {selectedAppeal.additionalInfo}
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedAppeal.status === 'pending' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Admin Notes
                        </label>
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 resize-none text-sm"
                          placeholder="Add notes about your decision..."
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={handleApprove}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm font-medium"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={handleDeny}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm font-medium"
                        >
                          <X className="w-4 h-4" />
                          <span>Deny</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedAppeal.status !== 'pending' && selectedAppeal.adminNotes && (
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm font-medium text-slate-700 mb-2">Admin Decision Notes</p>
                      <p className="text-sm text-slate-900">{selectedAppeal.adminNotes}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        Reviewed: {formatDate(selectedAppeal.reviewedAt || '')}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-6 text-center">
                  <Eye className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <h3 className="font-medium text-slate-900 mb-1">Select an Appeal</h3>
                  <p className="text-sm text-slate-600">
                    Click on an appeal from the list to view details and take action
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;