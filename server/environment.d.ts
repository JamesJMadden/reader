declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PWD: string;
      SPEECH_KEY: string;
      SPEECH_REGION: string;
    }
  }
}

export {};
