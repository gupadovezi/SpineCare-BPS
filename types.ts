export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export enum AssessmentStep {
  WELCOME = 0,
  RED_FLAGS = 1,
  BIOLOGICAL = 2,
  PSYCHOLOGICAL = 3,
  SOCIAL = 4,
  COMPLETE = 5
}

export interface UserAssessment {
  redFlags: string[];
  painDuration: string;
  painIntensity: number; // 0-10
  aggravatingFactors: string[];
  fearAvoidance: number; // 0-10 (How afraid are you to move?)
  stressLevel: number; // 0-10
  mood: string;
  workStatus: string;
  socialSupport: string;
  goals: string;
}

export const INITIAL_ASSESSMENT: UserAssessment = {
  redFlags: [],
  painDuration: '',
  painIntensity: 5,
  aggravatingFactors: [],
  fearAvoidance: 0,
  stressLevel: 0,
  mood: '',
  workStatus: '',
  socialSupport: '',
  goals: ''
};