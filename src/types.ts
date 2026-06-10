export type SocialPlatform = 'instagram' | 'tiktok' | 'facebook';

export type TaskStatus = 'idle' | 'visiting' | 'verifying' | 'completed';

export interface SocialTask {
  id: string;
  platform: SocialPlatform;
  title: string;
  description: string;
  handle: string;
  url: string;
  rewardNpr: number;
  status: TaskStatus;
}

export interface AppConfig {
  instagramUrl: string;
  instagramHandle: string;
  tiktokUrl: string;
  tiktokHandle: string;
  facebookUrl: string;
  facebookHandle: string;
  verificationInstructions: string;
  adminSecret: string; // optional basic password
}

export interface RewardClaim {
  id: string; // unique reference code e.g. CLAIM-8492-NPR
  timestamp: string;
  tasksCompletedCount: number;
  totalNpr: number;
  status: 'pending' | 'copied' | 'claimed';
}
