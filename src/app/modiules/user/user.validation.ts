import z from 'zod';

// Address schema for embedded objects like location
// const addressSchema = z.object({
//   street: z.string().optional(),
//   city: z.string().optional(),
//   state: z.string().optional(),
//   country: z.string().optional(),
//   zipCode: z.string().optional(),
// });

// User validation schema
const createUserValidationSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(1, 'Username is required')
      .max(100, 'Username too long')
      .optional(),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    profilePicture: z.string().optional(),
    coverPhoto: z.string().optional(),
    bio: z.string().optional(),
    website: z.string().optional(),
    location: z.string().optional(),
    followers: z.array(z.string()).optional(),
    following: z.array(z.string()).optional(),
    friends: z.array(z.string()).optional(),
    id: z.string().optional(),
    role: z.enum(['user', 'admin']).default('user'),
    isDeleted: z.boolean().default(false),
    currentState: z.enum(['pro', 'free']).default('free'),
    address: z.string().optional().optional(),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .optional(),
  }),
});

// Exporting the validation schema
export const userValidation = {
  createUserValidationSchema,
};