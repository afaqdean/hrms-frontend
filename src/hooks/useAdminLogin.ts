// // Import Axios for making HTTP requests
// import type { AxiosError } from 'axios';

// import type { AuthTokens } from '../context/interfaces/AuthContextInterface';
// // Define an interface for the form data
// import type {
//   LoginFormData,
//   LoginResponseData,
//   UserData,
// } from '../interfaces/LoginInter';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
// // Import React hooks for managing state and effects
// import { useCallback, useContext } from 'react';
// // Import React Hook Form for handling form validation and submission
// import { useForm } from 'react-hook-form';
// // Import React Router hook for navigation
// import { useNavigate } from 'react-router-dom';

// // Import React Toastify for displaying notifications
// import { toast } from 'react-toastify';
// import { ToastStyle } from '../components/ToastStyle';
// import { BASE_URL } from '../constants/ConfigUrls';
// import { AuthContext } from '../context/AuthContext';
// import { extractErrorMessage } from '../utils/Error';
// // Import React Query hooks for data fetching and caching
// import 'react-toastify/dist/ReactToastify.css';

// // Define a custom hook for managing login logic
// const useAdminLogin = () => {
//   const authState = useContext(AuthContext);
//   const { isAuthenticated, updateAuthenticationState } = authState;

//   // Destructure the useForm hook to get the register, handleSubmit and errors functions
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>();
//   // Get the queryClient instance from React Query
//   const queryClient = useQueryClient();
//   // Get the navigate function from React Router
//   const navigate = useNavigate();

//   // Handle form submission
//   const onSubmit = async (data: LoginFormData) => {
//     if (!isAuthenticated) {
//       try {
//         // Call the mutation function with the form data and wait for it to resolve
//         const response = await handleAdminLoginMutation.mutateAsync(data);

//         if (response.tokens) {
//           navigate('/admin-overview');
//         }
//         // Navigate to the dashboard page after successful login
//       } catch (err) {
//         // Catch any error while logging in and display the error message
//         // toast.error(extractErrorMessage(err));
//         toast.error(extractErrorMessage(err));
//       }
//     }
//   };

//   // Use an effect hook to check if the user is already logged in
//   // useEffect(() => {
//   //   // Get the access token from local storage
//   // }, [navigate]); // Run the effect only when the isAuth query changes

//   // Define a mutation hook for sending login requests to the server
//   const handleAdminLoginMutation = useMutation<
//     LoginResponseData,
//     AxiosError,
//     LoginFormData
//   >(
//     async (LoginFormData: LoginFormData) => {
//       // Send a POST request to the login endpoint with the form data and get the response
//       const res = await axios.post<LoginResponseData>(
//         `${BASE_URL}/auth/login`,
//         { ...LoginFormData, role: 'Admin' },
//       );

//       // Return the response data as the mutation result
//       return res.data;
//     },
//     {
//       // Define a callback function for handling mutation success
//       onSuccess: (data: { tokens: AuthTokens; user: UserData }) => {
//         const authTokens = data?.tokens as AuthTokens;
//         const userData = data?.user as UserData;

//         // Update the authentication state
//         updateAuthenticationState({ authTokens, userData });

//         // Store the access token, refresh token and user data in local storage
//         window.localStorage.setItem('access-token', authTokens.access_token);
//         window.localStorage.setItem('refresh-token', authTokens.refresh_token);
//         window.localStorage.setItem('user', JSON.stringify(userData));
//         // Update the query data for isAuth, adminDisplayName and adminProfilePic with the response data
//         queryClient.setQueryData(['isAuth'], true);
//         queryClient.setQueryData(['adminDisplayName'], userData.displayName);
//         queryClient.setQueryData(['adminProfilePic'], userData.profilePic);

//         queryClient.invalidateQueries(['trainers']);
//         // Display a success message as a toast notification
//         toast.success('You have successfully logged in!', ToastStyle);
//       },
//     },
//   );

//   // Define a callback function for handling logout logic
//   const handleAdminLogout = useCallback(() => {
//     // Remove the access token, refresh token and user data from local storage
//     window.localStorage.removeItem('access-token');
//     window.localStorage.removeItem('refresh-token');
//     window.localStorage.removeItem('user');
//     // Update the query data for isAuth, adminId, adminProfilePic and adminDisplayName with null values
//     queryClient.setQueryData(['isAuth'], false);
//     queryClient.setQueryData(['adminId'], null);
//     queryClient.setQueryData(['adminProfilePic'], null);
//     queryClient.setQueryData(['adminDisplayName'], null);
//     updateAuthenticationState(null);
//     // Navigate to the home page after logout
//     navigate('/login');
//     // Display a success message as a toast notification
//     toast.success('You have successfully logged out!', ToastStyle);
//   }, [queryClient, navigate, updateAuthenticationState]); // Use queryClient and navigate as dependencies for the callback

//   // Return the mutation hook, the logout function, and the form-related functions and values
//   return {
//     handleAdminLoginMutation,
//     handleAdminLogout,
//     register,
//     handleSubmit,
//     errors,
//     onSubmit,
//   };
// };

// // Export the custom hook as a default export
// export default useAdminLogin;
