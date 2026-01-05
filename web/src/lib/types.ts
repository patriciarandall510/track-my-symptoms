import type { Timestamp } from "firebase/firestore";

export type PainLog = {
  id: string;
  userId: string;
  timestamp: Timestamp;
  painScore: number;
  location?: string;
  quality?: string;
  notes?: string;
  tags?: string[];
};

export type NewPainLog = Omit<PainLog, "id" | "timestamp"> & {
  timestamp: Date;
};

export type ActivityType = "pt" | "run" | "elliptical" | "long_drive" | "other";

export type ActivityEvent = {
  id: string;
  userId: string;
  timestamp: Timestamp;
  type: ActivityType;
  durationMinutes?: number | null;
  intensity?: "easy" | "moderate" | "hard" | null;
  notes?: string;
};

export type NewActivityEvent = Omit<ActivityEvent, "id" | "timestamp"> & {
  timestamp: Date;
};


