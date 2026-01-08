export type Favors = {
  id: string
  title: string;
  description: string | null;
  category: string;
  type: 'OFFER' | 'REQUEST';
  userName: string;
}