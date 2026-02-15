
export enum Dimension {
  CareerManagement = 'CAREER_MANAGEMENT',
  BehavioralBias = 'BEHAVIORAL_BIAS',
  LearningOrientation = 'LEARNING_ORIENTATION',
  CulturalValues = 'CULTURAL_VALUES',
  SelfValues = 'SELF_VALUES'
}

export interface Question {
  id: number;
  dimension: Dimension;
  text: string;
  options: {
    label: string;
    subDimension: string;
    value: string;
  }[];
}

export interface Scores {
  [key: string]: number;
}

export interface AnalysisResult {
  scores: Scores;
  summary: string;
  coreRadar: string;
}
