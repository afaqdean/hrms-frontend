import { z } from 'zod';

// Define validation schema using Zod
export const leaveSchema = z.object({
  leaveType: z.string().min(1, 'Leave type is required'),
  startDate: z.coerce.date({ required_error: 'Start date is required' }),
  endDate: z.coerce.date({ required_error: 'End date is required' }),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  attachment: z.any().nullable(),
}).refine(data => data.endDate >= data.startDate, {
  message: 'End date cannot be before start date',
  path: ['endDate'],
});

export type LeaveFormData = z.infer<typeof leaveSchema>;

// Personal Details Schema
export const personalDetailsSchema = z.object({
  employeeName: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(30, { message: 'Name cannot exceed 30 characters' })
    .regex(/^[A-Z\s]+$/i, {
      message: 'Name must only contain letters and spaces',
    }),

  jobTitle: z
    .string()
    .min(3, { message: 'Job title must be at least 3 characters' })
    .max(30, { message: 'Job title cannot exceed 30 characters' })
    .regex(/^[A-Z\s]+$/i, {
      message: 'Job title must only contain letters and spaces',
    }),

  employeeRole: z.string().min(1, 'Employee role is required').default('Employee'),

  avatar: z.union([
    z.string(),
    z.instanceof(File),
    z.object({
      file: z.string(),
      filename: z.string(),
      type: z.string(),
    }),
  ]).refine(
    (value) => {
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      if (value instanceof File) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        return allowedTypes.includes(value.type);
      }
      if (typeof value === 'object' && 'file' in value) {
        return value.file.trim().length > 0;
      }
      return false;
    },
    {
      message: 'Profile picture must be a valid image file (JPEG, PNG, JPG, GIF, or WEBP)',
    },
  ),

  joiningDate: z.coerce.date({ required_error: 'Joining date is required' }),
  originalFileName: z.string().optional(),
});

export type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;

// Account Details Schema
export const accountDetailsSchema = z.object({
  employeeId: z
    .string()
    .regex(/^CH-PK-\d{3}$/, {
      message: 'Employee ID must be in the format CH-PK-XXX (e.g., CH-PK-019)',
    }),

  machineId: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) {
          return true;
        } // allow empty
        return /^\d+$/.test(val) && !/^0+$/.test(val); // only digits, not all zeros
      },
      {
        message: 'Machine ID must be digits only and not all zeros.',
      },
    ),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email format' })
    .max(100, { message: 'Email must be at most 100 characters long' }),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .optional()
    .refine(
      (val) => {
        if (!val) {
          return true;
        } // Allow empty password
        return val.length >= 8; // If provided, must be at least 8 characters
      },
      {
        message: 'Password must be at least 8 characters long when provided',
      },
    ),
});

export type AccountDetailsFormValues = z.infer<typeof accountDetailsSchema>;

// Contact Details Schema
export const contactDetailsSchema = z.object({
  contact: z
    .object({
      phone: z
        .string()
        .refine(
          (value) => {
            if (!value) {
              return true;
            }
            return /^03\d{9}$/.test(value); // Must start with 03 and be 11 digits
          },
          {
            message: 'Phone number must start with 03 and be exactly 11 digits (e.g., 03XXXXXXXXX)',
          },
        )
        .optional()
        .nullish(),

      address: z
        .string()
        .refine(
          (value) => {
            if (!value) {
              return true;
            }
            return value.length >= 3 && value.length <= 100;
          },
          {
            message: 'Address must be between 3 and 100 characters when provided',
          },
        )
        .optional()
        .nullish(),
    })
    .optional()
    .nullish()
    .transform(val => val || undefined),
});

export type ContactDetailsFormValues = z.infer<typeof contactDetailsSchema>;

// Emergency Contact Schema
export const emergencyContactDetailsSchema = z.object({
  emergencyContact: z
    .object({
      contact1: z
        .object({
          phone: z
            .string()
            .refine(
              (value) => {
                if (!value) {
                  return true;
                }
                return /^03\d{9}$/.test(value);
              },
              {
                message: 'Emergency contact must start with 03 and be exactly 11 digits (e.g., 03XXXXXXXXX)',
              },
            )
            .optional()
            .nullish(),

          relation: z
            .string()
            .refine(
              (value) => {
                if (!value) {
                  return true;
                }
                return /^[A-Z\s]+$/i.test(value) && value.length >= 3 && value.length <= 30;
              },
              {
                message: 'Relation must be 3-30 characters and contain only letters and spaces',
              },
            )
            .optional()
            .nullish(),
        })
        .optional()
        .nullish(),

      contact2: z
        .object({
          phone: z
            .string()
            .refine(
              (value) => {
                if (!value) {
                  return true;
                }
                return /^03\d{9}$/.test(value);
              },
              {
                message: 'Emergency contact must start with 03 and be exactly 11 digits (e.g., 03XXXXXXXXX)',
              },
            )
            .optional()
            .nullish(),

          relation: z
            .string()
            .refine(
              (value) => {
                if (!value) {
                  return true;
                }
                return /^[A-Z\s]+$/i.test(value) && value.length >= 3 && value.length <= 30;
              },
              {
                message: 'Relation must be 3-30 characters and contain only letters and spaces',
              },
            )
            .optional()
            .nullish(),
        })
        .optional()
        .nullish(),

      address: z
        .string()
        .refine(
          (value) => {
            if (!value) {
              return true;
            }
            return value.length >= 3;
          },
          {
            message: 'Emergency contact address must be at least 3 characters',
          },
        )
        .optional()
        .nullish(),
    })
    .optional()
    .nullish()
    .transform(val => val || undefined),
});

export type EmergencyContactDetailsFormValues = z.infer<typeof emergencyContactDetailsSchema>;

// Leave Count Schema (Assuming string inputs from form)
export const leavesCountSchema = z.object({
  expiryDate: z.string().optional(),
  sickLeave: z.string().optional(),
  casualLeave: z.string().optional(),
  annualLeave: z.string().optional(),
});

export type LeavesCountFormValues = z.infer<typeof leavesCountSchema>;
