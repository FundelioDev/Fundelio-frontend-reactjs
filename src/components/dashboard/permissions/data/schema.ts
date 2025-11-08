import { z } from 'zod';

export const permissionSchema = z.object({
  permissionId: z.string(),
  name: z.string(),
  apiPath: z.string(),
  httpMethod: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  module: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
});

export type Permission = z.infer<typeof permissionSchema>;
