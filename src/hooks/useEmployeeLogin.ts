// import "react-toastify/dist/ReactToastify.css";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios, { AxiosError } from "axios";
// import { useCallback, useContext } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// import {
//   LoginFormData,
//   LoginResponseData,
//   UserData,
// } from "../interfaces/LoginInter";
// import { AuthContext } from "../context/AuthContext";
// import { AuthTokens } from "../context/interfaces/AuthContextInterface";
// import { BASE_URL } from "../constants/ConfigUrls";
// import { ToastStyle } from "../components/ToastStyle";
// import { extractErrorMessage } from "../utils/Error";

// // Define a custom hook for managing employee login logic
// const useEmployeeLogin = () => {
//   const authState = useContext(AuthContext);
//   const { isAuthenticated, updateAuthenticationState } = authState;

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>();

//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   // Handle form submission
//   const onSubmit = async (data: LoginFormData) => {
//     if (!isAuthenticated) {
//       try {
//         const response = await handleEmployeeLoginMutation.mutateAsync(data);

//         if (response.tokens) {
//           navigate("/Overview"); // Navigate to employee dashboard
//         }
//       } catch (err) {
//         toast.error(extractErrorMessage(err));
//       }
//     }
//   };

//   // Define a mutation hook for sending login requests to the server
//   const handleEmployeeLoginMutation = useMutation<
//     LoginResponseData,
//     AxiosError,
//     LoginFormData
//   >(
//     async (LoginFormData: LoginFormData) => {
//       const res = await axios.post<LoginResponseData>(
//         `${BASE_URL}/auth/login`,
//         { ...LoginFormData, role: "Employee" } // Set role as 'Employee'
//       );

//       return res.data;
//     },
//     {
//       onSuccess: (data: { tokens: AuthTokens; user: UserData }) => {
//         const authTokens = data?.tokens as AuthTokens;
//         const userData = data?.user as UserData;

//         updateAuthenticationState({ authTokens, userData });

//         window.localStorage.setItem("access-token", authTokens.access_token);
//         window.localStorage.setItem("refresh-token", authTokens.refresh_token);
//         window.localStorage.setItem("user", JSON.stringify(userData));

//         queryClient.setQueryData(["isAuth"], true);
//         queryClient.setQueryData(["employeeDisplayName"], userData.displayName);
//         queryClient.setQueryData(["employeeProfilePic"], userData.profilePic);

//         queryClient.invalidateQueries(["projects"]); // Assuming you want to refresh project-related data
//         toast.success("You have successfully logged in!", ToastStyle);
//       },
//     }
//   );

//   // Define a callback function for handling logout logic
//   const handleEmployeeLogout = useCallback(() => {
//     window.localStorage.removeItem("access-token");
//     window.localStorage.removeItem("refresh-token");
//     window.localStorage.removeItem("user");

//     queryClient.setQueryData(["isAuth"], false);
//     queryClient.setQueryData(["employeeId"], null);
//     queryClient.setQueryData(["employeeProfilePic"], null);
//     queryClient.setQueryData(["employeeDisplayName"], null);
//     updateAuthenticationState(null);

//     navigate("/login");
//     toast.success("You have successfully logged out!", ToastStyle);
//   }, [queryClient, navigate, updateAuthenticationState]);

//   return {
//     handleEmployeeLoginMutation,
//     handleEmployeeLogout,
//     register,
//     handleSubmit,
//     errors,
//     onSubmit,
//   };
// };

// export default useEmployeeLogin;
