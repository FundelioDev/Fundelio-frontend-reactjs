import { z } from 'zod';

export const roleLevelSchema = z.union([
  z.literal('high'),
  z.literal('medium'),
  z.literal('low'),
]);
export type RoleLevel = z.infer<typeof roleLevelSchema>;

export const roleStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
]);
export type RoleStatus = z.infer<typeof roleStatusSchema>;

export const roleTypeSchema = z.union([
  z.literal('superadmin'),
  z.literal('admin'),
  z.literal('manager'),
]);
export type RoleType = z.infer<typeof roleTypeSchema>;

export const modulePermissionSchema = z.object({
  create: z.boolean().default(false),
  read: z.boolean().default(false),
  update: z.boolean().default(false),
  delete: z.boolean().default(false),
});

export type ModulePermission = z.infer<typeof modulePermissionSchema>;

const moduleSchema = z.record(modulePermissionSchema);

export const permissionSchema = z.object({
  permissionId: z.string(),
  name: z.string(),
  apiPath: z.string(),
  httpMethod: z.string(),
  module: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
});

export type Permission = z.infer<typeof permissionSchema>;

export const roleSchema = z.object({
  roleId: z.string(),
  name: z.string(),
  description: z.string(),
  active: z.boolean(),
  permissions: z.array(permissionSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
});

export type Role = z.infer<typeof roleSchema>;

export const metaSchema = z.object({
  currentPage: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export type Meta = z.infer<typeof metaSchema>;

export const roleResponseSchema = z.object({
  code: z.number(),
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    meta: metaSchema,
    content: z.array(roleSchema),
  }),
  timestamp: z.string(),
  path: z.string(),
});

export type RoleResponse = z.infer<typeof roleResponseSchema>;
