
export default interface Vocabulary{
    id: string;
    word: string;
    definition: string;
    example: string[];
}

export type VocabularyExplainProps = {
  word: string;
  definition: string;
  example?: string;
  extraInfo?: string;
};