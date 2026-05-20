export interface Channel {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  participants: string[];
  admins?: string[];
}
