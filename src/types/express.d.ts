declare global {
  namespace Express {
    interface Request {
      session?: {
        jwt?: string;
      } | null;
    }
  }
}

export {};