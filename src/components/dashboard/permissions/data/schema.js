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

// Permission type inferred from schema
// Use: const permission = permissionSchema.parse(data)
// Or access properties directly: permission.permissionId, permission.name, etc.

