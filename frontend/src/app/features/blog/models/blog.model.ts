export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
  author: string;
  authorInitials: string;
  authorBgClass?: string;
  highlighted?: boolean;
}
