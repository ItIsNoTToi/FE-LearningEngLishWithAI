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
  content?: string; // văn bản, HTML, JSON...
  createdAt?: Date;
  updatedAt?: Date;
  status?: string; // hoặc có thể dùng enum nếu status có giới hạn giá trị
}
