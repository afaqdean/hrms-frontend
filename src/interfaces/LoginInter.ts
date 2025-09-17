// Define an interface for the user data
export type UserData = {
  displayName: string;
  profilePic: string;
};

// Define an interface for the tokens data
export type TokensData = {
  access_token: string;
  refresh_token: string;
};

export type LoginResponseData = {
  tokens: TokensData;
  user: UserData;
};

// Define an interface for the login response data

// Define the shape of login form data
export type LoginFormData = {
  email: string;
  password: string;
  role: string;
};

// Define the variables for mutation request
export type LoginMutationVariables = {
  formData: LoginFormData;
};

export type LoginProps = {
  onLogin?: () => void;
};
