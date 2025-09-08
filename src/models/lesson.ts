export default interface Lesson {
  _id: string;
  title: string;
  description?: string;
  vocabulary?: [{
    word: string;
    meaning: string;
    example: string;
  }];
  level: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  content?: string; // văn bản, HTML, JSON...
  createdAt?: Date;
  updatedAt?: Date;
  status?: 'close' | 'open';
}
