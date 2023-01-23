export interface ErrorResponse {
  httpCode: number;
  httpTitle: string;
  timestamp: Date;
  path: string;
  userMessage: string;
  errors: ErrorDto[];
}

export interface ErrorDto {
  param: string;
  value: any;
  description: string;
}