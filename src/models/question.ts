export default interface Question {
  id: string,
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string,
}