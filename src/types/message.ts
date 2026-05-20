export interface Message {
  id?: string;
  channelId: string;
  userId: string;
  text: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    username: string;
    image?: string;
  };
}
