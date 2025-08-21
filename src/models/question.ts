export interface Question {
  id: string;
  question: string;
  options: {
    text: string;
    isCorrect?: boolean;
  }[];
  explanation: string;
}
