import { z } from 'zod';

export const submissionSchema = z.object({
  jettonMaster: z.string().min(10),
  name: z.string().min(1).max(64),
  symbol: z.string().min(1).max(16),
  description: z.string().max(1000).optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  telegram: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  category: z.string().max(32).optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  submitterWallet: z.string().optional().or(z.literal('')),
});

export const voteSchema = z.object({
  tokenId: z.string().min(1),
  voterWallet: z.string().min(5)
});
