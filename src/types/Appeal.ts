export interface AppealData {
  id?: string;
  playerName: string;
  discordTag: string;
  steamId: string;
  banDate: string;
  banReason: string;
  appealReason: string;
  additionalInfo: string;
  acknowledgment: boolean;
  submittedAt?: string;
  status?: 'pending' | 'approved' | 'denied';
  adminNotes?: string;
  reviewedAt?: string;
}