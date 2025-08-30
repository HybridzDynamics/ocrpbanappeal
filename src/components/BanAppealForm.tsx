import React, { useState } from 'react';
import { AppealData } from '../types/Appeal';
import { Send, AlertCircle, CheckCircle, User, Calendar, MessageSquare, FileText, ExternalLink } from 'lucide-react';

interface BanAppealFormProps {
  onSubmit: (data: AppealData) => void;
}

const BanAppealForm: React.FC<BanAppealFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Omit<AppealData, 'id' | 'submittedAt' | 'status'>>({
    playerName: '',
    discordTag: '',
    steamId: '',
    banDate: '',
    banReason: '',
    appealReason: '',
    additionalInfo: '',
    acknowledgment: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.playerName.trim()) {
      newErrors.playerName = 'Player name is required';
    }

    if (!formData.discordTag.trim()) {
      newErrors.discordTag = 'Discord tag is required';
    } else if (!formData.discordTag.includes('#') && !formData.discordTag.includes('@')) {
      newErrors.discordTag = 'Please provide a valid Discord tag (e.g., username#1234 or @username)';
    }

    if (!formData.steamId.trim()) {
      newErrors.steamId = 'Steam ID is required';
    }

    if (!formData.banDate) {
      newErrors.banDate = 'Ban date is required';
    }

    if (!formData.banReason.trim()) {
      newErrors.banReason = 'Ban reason is required';
    }

    if (!formData.appealReason.trim()) {
      newErrors.appealReason = 'Appeal reason is required';
    } else if (formData.appealReason.length < 50) {
      newErrors.appealReason = 'Appeal reason must be at least 50 characters';
    }

    if (!formData.acknowledgment) {
      newErrors.acknowledgment = 'You must acknowledge the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      submitToDiscord();
    }
  };

  const submitToDiscord = async () => {
    try {
      const webhookUrl = 'https://discord.com/api/webhooks/1411364971320971425/_TYP8yr6k-Ko0UK19MITNBo4sjksssGMqgx9CUvy2WU7h92gdYh1QH6Jypf1lG0t7giI';
      
      const embed = {
        title: "🚨 New Ban Appeal Submitted",
        color: 0x1e40af, // Blue color
        fields: [
          {
            name: "👤 Player Information",
            value: `**Name:** ${formData.playerName}\n**Discord:** ${formData.discordTag}\n**Steam ID:** ${formData.steamId}`,
            inline: false
          },
          {
            name: "📅 Ban Details",
            value: `**Date:** ${formData.banDate}\n**Reason:** ${formData.banReason}`,
            inline: false
          },
          {
            name: "📝 Appeal Reason",
            value: formData.appealReason.length > 1000 
              ? formData.appealReason.substring(0, 1000) + "..." 
              : formData.appealReason,
            inline: false
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "Orlando City RP Ban Appeal System"
        }
      };

      if (formData.additionalInfo) {
        embed.fields.push({
          name: "ℹ️ Additional Information",
          value: formData.additionalInfo.length > 500 
            ? formData.additionalInfo.substring(0, 500) + "..." 
            : formData.additionalInfo,
          inline: false
        });
      }

      const payload = {
        content: `@here New ban appeal from **${formData.playerName}**`,
        embeds: [embed]
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onSubmit(formData);
        setIsSubmitted(true);
      } else {
        throw new Error('Failed to submit appeal');
      }
    } catch (error) {
      console.error('Error submitting appeal:', error);
      alert('Failed to submit appeal. Please try again or contact an administrator.');
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Appeal Submitted Successfully</h2>
          <p className="text-slate-600 mb-6">
            Your ban appeal has been submitted and is now under review. You will receive an update
            via Discord within 24-48 hours.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-medium">Appeal ID: #{Date.now()}</p>
            <p className="text-blue-600 text-sm mt-1">Save this ID for your records</p>
          </div>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-200"
          >
            Submit Another Appeal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">Submit Ban Appeal</h1>
          <p className="text-blue-100 mt-2">Please provide accurate information for your appeal review</p>
        </div>

        <div className="p-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Important Guidelines:</p>
                <ul className="list-disc list-inside space-y-1 text-amber-700">
                  <li>Be honest and detailed in your appeal</li>
                  <li>False information will result in appeal denial</li>
                  <li>Multiple frivolous appeals may result in permanent ban</li>
                  <li>Appeals are reviewed within 24-48 hours</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Player Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                <User className="w-5 h-5 text-blue-800" />
                <h2 className="text-lg font-semibold text-slate-900">Player Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    In-Game Player Name *
                  </label>
                  <input
                    type="text"
                    value={formData.playerName}
                    onChange={(e) => handleInputChange('playerName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      errors.playerName ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="e.g., John_Smith"
                  />
                  {errors.playerName && (
                    <p className="text-red-600 text-sm mt-1">{errors.playerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Discord Tag *
                  </label>
                  <input
                    type="text"
                    value={formData.discordTag}
                    onChange={(e) => handleInputChange('discordTag', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      errors.discordTag ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="e.g., username#1234 or @username"
                  />
                  {errors.discordTag && (
                    <p className="text-red-600 text-sm mt-1">{errors.discordTag}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Steam ID64 *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.steamId}
                      onChange={(e) => handleInputChange('steamId', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        errors.steamId ? 'border-red-300 bg-red-50' : 'border-slate-300'
                      }`}
                      placeholder="e.g., 76561198000000000"
                    />
                    
                  </div>
                  {errors.steamId && (
                    <p className="text-red-600 text-sm mt-1">{errors.steamId}</p>
                  )}
                  <p className="text-slate-500 text-sm mt-1">
                    Don't know your Steam ID? Click the link icon to find it
                  </p>
                </div>
              </div>
            </div>

            {/* Ban Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                <Calendar className="w-5 h-5 text-blue-800" />
                <h2 className="text-lg font-semibold text-slate-900">Ban Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ban Date *
                  </label>
                  <input
                    type="date"
                    value={formData.banDate}
                    onChange={(e) => handleInputChange('banDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      errors.banDate ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.banDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.banDate}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Reason Given for Ban *
                  </label>
                  <textarea
                    value={formData.banReason}
                    onChange={(e) => handleInputChange('banReason', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none ${
                      errors.banReason ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Copy the exact ban reason provided by staff..."
                  />
                  {errors.banReason && (
                    <p className="text-red-600 text-sm mt-1">{errors.banReason}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Appeal Details */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                <MessageSquare className="w-5 h-5 text-blue-800" />
                <h2 className="text-lg font-semibold text-slate-900">Appeal Details</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Why should your ban be lifted? *
                </label>
                <textarea
                  value={formData.appealReason}
                  onChange={(e) => handleInputChange('appealReason', e.target.value)}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none ${
                    errors.appealReason ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="Explain your side of the story, acknowledge any mistakes, and explain why you deserve another chance..."
                />
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-sm ${
                    formData.appealReason.length < 50 ? 'text-red-500' : 'text-slate-500'
                  }`}>
                    {formData.appealReason.length}/50 minimum characters
                  </span>
                  {errors.appealReason && (
                    <p className="text-red-600 text-sm">{errors.appealReason}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                  placeholder="Any additional context, evidence, or information that might help your appeal..."
                />
                <p className="text-slate-500 text-sm mt-1">
                  Include any relevant screenshots, video links, or witness information
                </p>
              </div>
            </div>

            {/* Acknowledgment */}
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="acknowledgment"
                  checked={formData.acknowledgment}
                  onChange={(e) => handleInputChange('acknowledgment', e.target.checked)}
                  className="w-5 h-5 text-blue-800 border-slate-300 rounded focus:ring-blue-500 mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="acknowledgment" className="text-sm text-slate-700 leading-relaxed">
                    I acknowledge that I have read and understand the 
                    <a href="#" className="text-blue-600 hover:text-blue-800 mx-1 underline">
                      Orlando City RP Rules
                    </a>
                    and 
                    <a href="#" className="text-blue-600 hover:text-blue-800 mx-1 underline">
                      Appeal Policy
                    </a>. 
                    I understand that providing false information or submitting frivolous appeals 
                    may result in my appeal being denied and potential further penalties.
                  </label>
                  {errors.acknowledgment && (
                    <p className="text-red-600 text-sm mt-1">{errors.acknowledgment}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-900 hover:to-blue-800 transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-200 flex items-center justify-center space-x-2 shadow-lg"
            >
              <Send className="w-5 h-5" />
              <span>Submit Ban Appeal</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BanAppealForm;