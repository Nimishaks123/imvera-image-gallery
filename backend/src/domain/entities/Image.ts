export interface Image {
  id: string;
  userId: string;
  title: string;
  key: string;
  url?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
