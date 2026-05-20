import { apiClient } from './axios';

export interface VideoCallRequest {
  channelId: string;
  callerId: string;
  invitedUsers: string[];
}

export interface VideoCallResponse {
  callId: string;
  channelId: string;
  callerId: string;
  status: string;
  participants: string[];
  createdAt: string;
}

export const videoAPI = {
  initiateCall: (data: VideoCallRequest) =>
    apiClient.post<VideoCallResponse>('/video/call/initiate', data),

  getCallDetails: (callId: string) =>
    apiClient.get<VideoCallResponse>(`/video/call/${callId}`),
};
