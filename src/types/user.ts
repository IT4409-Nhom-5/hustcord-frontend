export interface User {
  id: string;
  email: string;
  username: string;
  about?: string;
  image?: string;
  friends?: string[];
  blocked?: string[];
  requests?: string[];
}
