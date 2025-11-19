import { z } from 'zod';

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
]);

export const userSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  isVerified: z.boolean(),
  roles: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      active: z.boolean(),
      permissions: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          apiPath: z.string(),
          httpMethod: z.string(),
          module: z.string(),
        })
      ),
    })
  ),
  createdAt: z.string(),
  provider: z.string().optional(),
});

export const userListSchema = z.array(userSchema);

