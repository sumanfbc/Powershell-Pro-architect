
export interface PSFunctionRequest {
  description: string;
  complexity: 'simple' | 'standard' | 'advanced';
  includeHelp: boolean;
  includeErrorHandling: boolean;
}

export interface PSFunctionResponse {
  code: string;
  explanation: string;
  bestPractices: string[];
}

export enum AppStatus {
  IDLE = 'idle',
  GENERATING = 'generating',
  SUCCESS = 'success',
  ERROR = 'error'
}
