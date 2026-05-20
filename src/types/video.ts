export interface VideoCall {
  callId: string;
  channelId: string;
  callerId: string;
  status: 'active' | 'ended' | 'missed';
  participants: string[];
  createdAt: string;
  endedAt?: string;
}
