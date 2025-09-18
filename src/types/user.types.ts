
export type User = {
  _id?: string;
  name: string;
  email: string;
  refresh_tokens?: string[];
  credits: number,
  created_at?: string;
};

