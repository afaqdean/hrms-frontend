// Define allowed roles
export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// Custom session type with our application-specific properties
export type ExtendedSession = {
  user: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    profilePic?: string;
    employeeID?: string;
    position?: string;
  };
  accessToken?: string;
  error?: string;
};
