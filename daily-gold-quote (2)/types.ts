export interface Quote {
  content: string;
  author: string;
  context?: string; // Optional brief explanation or context
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

// Global declaration for html2canvas if loaded via script tag
declare global {
  interface Window {
    html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
  }
}