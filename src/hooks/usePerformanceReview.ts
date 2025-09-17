import { API } from '@/Interceptors/Interceptor';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Types
export type KPIQuestion = {
  _id: string;
  question: string;
  category: string;
  questionType: 'text' | 'yes_no' | 'rating';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ReviewRequest = {
  _id: string;
  title: string;
  dueDate: Date;
  revieweeId: {
    _id: string;
    name: string;
    employeeID: string;
  };
  initiatedBy: {
    _id: string;
    name: string;
  };
  assignedReviewers: Array<{
    _id: string;
    name: string;
    employeeID: string;
  }>;
  kpiQuestions: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
};

export type Review = {
  _id: string;
  reviewRequestId: string;
  reviewerId: {
    _id: string;
    name: string;
    employeeID: string;
  };
  revieweeId: {
    _id: string;
    name: string;
    employeeID: string;
  };
  answers: Array<{
    questionId: string;
    answer: string;
    additionalComments?: string;
  }>;
  comments?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateKPIQuestionData = {
  question: string;
  category: string;
  questionType: 'text' | 'yes_no' | 'rating';
};

export type CreateReviewRequestData = {
  title: string;
  dueDate: string;
  revieweeId: string;
  assignedReviewers?: string[];
  kpiQuestions: string[];
};

export type CreateReviewData = {
  reviewRequestId: string;
  answers: Array<{
    questionId: string;
    answer: string;
    additionalComments?: string;
  }>;
  comments?: string;
};

// KPI Questions
export const useKPIQuestions = () => {
  return useQuery({
    queryKey: ['kpi-questions'],
    queryFn: async (): Promise<KPIQuestion[]> => {
      const response = await API.get('/api/performance-review/questions');
      return response.data;
    },
  });
};

export const useCreateKPIQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateKPIQuestionData): Promise<KPIQuestion> => {
      const response = await API.post('/api/performance-review/questions', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi-questions'] });
      toast.success('KPI Question created successfully');
    },
    onError: (error: unknown) => {
      console.error('Error creating KPI question:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
            ? String(error.response.data.message)
            : 'Failed to create KPI question');
      toast.error(errorMessage);
    },
  });
};

// Review Requests
export const useReviewRequests = () => {
  return useQuery({
    queryKey: ['review-requests'],
    queryFn: async (): Promise<ReviewRequest[]> => {
      const response = await API.get('/api/performance-review/requests');
      return response.data;
    },
  });
};

export const useCreateReviewRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReviewRequestData): Promise<ReviewRequest> => {
      const response = await API.post('/api/performance-review/requests', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review-requests'] });
      toast.success('Review request created successfully');
    },
    onError: (error: unknown) => {
      console.error('Error creating review request:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
            ? String(error.response.data.message)
            : 'Failed to create review request');
      toast.error(errorMessage);
    },
  });
};

export const useDeleteReviewRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string): Promise<void> => {
      await API.delete(`/api/performance-review/requests/${requestId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review-requests'] });
      toast.success('Review request deleted successfully');
    },
    onError: (error: unknown) => {
      console.error('Error deleting review request:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
            ? String(error.response.data.message)
            : 'Failed to delete review request');
      toast.error(errorMessage);
    },
  });
};

// Reviews
export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: async (): Promise<Review[]> => {
      const response = await API.get('/api/performance-review/reviews');
      return response.data;
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReviewData): Promise<Review> => {
      const response = await API.post('/api/performance-review/reviews', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-review-requests'] });
      toast.success('Review submitted successfully');
    },
    onError: (error: unknown) => {
      console.error('Error submitting review:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 409) {
        toast.error('Review already submitted for this request');
      } else if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 400) {
        toast.error('Review request is no longer active');
      } else {
        toast.error('Failed to submit review');
      }
    },
  });
};

// Employee sees reviews assigned to them to complete
export const useEmployeeAssignedReviews = (employeeId: string) => {
  return useQuery({
    queryKey: ['assigned-review-requests', employeeId],
    queryFn: async (): Promise<ReviewRequest[]> => {
      const response = await API.get(`/api/performance-review/requests/reviewer/${employeeId}`);
      return response.data;
    },
    enabled: !!employeeId,
  });
};

export const useEmployeeReviews = (employeeId: string) => {
  return useQuery({
    queryKey: ['reviews', employeeId],
    queryFn: async (): Promise<Review[]> => {
      const response = await API.get(`/api/performance-review/reviews/employee/${employeeId}`);
      return response.data;
    },
    enabled: !!employeeId,
  });
};

// Get reviews where employee is the reviewer (not the reviewee)
export const useEmployeeReviewerReviews = (employeeId: string) => {
  return useQuery({
    queryKey: ['reviewer-reviews', employeeId],
    queryFn: async (): Promise<Review[]> => {
      const response = await API.get(`/api/performance-review/reviews/reviewer/${employeeId}`);
      return response.data;
    },
    enabled: !!employeeId,
  });
};

// Admin sees all review requests for a specific employee
export const useEmployeeReviewRequests = (employeeId: string) => {
  return useQuery({
    queryKey: ['employee-review-requests', employeeId],
    queryFn: async (): Promise<ReviewRequest[]> => {
      const response = await API.get(`/api/performance-review/requests/employee/${employeeId}`);
      return response.data;
    },
    enabled: !!employeeId,
  });
};

// Get a specific review request by ID
export const useReviewRequest = (requestId: string) => {
  return useQuery({
    queryKey: ['review-request', requestId],
    queryFn: async (): Promise<ReviewRequest> => {
      const response = await API.get(`/api/performance-review/requests/${requestId}`);
      return response.data;
    },
    enabled: !!requestId,
  });
};

// Get a specific review by ID
export const useReview = (reviewId: string) => {
  return useQuery({
    queryKey: ['review', reviewId],
    queryFn: async (): Promise<Review> => {
      const response = await API.get(`/api/performance-review/reviews/${reviewId}`);
      return response.data;
    },
    enabled: !!reviewId,
  });
};

// Get all reviews for a specific review request
export const useReviewsByRequestId = (requestId: string) => {
  return useQuery({
    queryKey: ['reviews-by-request', requestId],
    queryFn: async (): Promise<Review[]> => {
      const response = await API.get(`/api/performance-review/reviews/request/${requestId}`);
      return response.data;
    },
    enabled: !!requestId,
  });
};

// Get KPI questions by IDs
export const useKPIQuestionsByIds = (questionIds: string[]) => {
  return useQuery({
    queryKey: ['kpi-questions', questionIds],
    queryFn: async (): Promise<KPIQuestion[]> => {
      if (!questionIds || questionIds.length === 0) {
        return [];
      }
      // Fetch questions by IDs using the correct endpoint
      const response = await API.get(`/api/performance-review/questions?ids=${questionIds.join(',')}`);
      return response.data;
    },
    enabled: questionIds.length > 0,
  });
};
