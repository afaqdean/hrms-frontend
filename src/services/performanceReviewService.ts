import type {
  CreateKPIQuestionRequest,
  CreateReviewRequest,
  CreateReviewRequestRequest,
  KPIQuestion,
  Review,
  ReviewRequest,
} from '@/interfaces/PerformanceReview';
import { API } from '@/Interceptors/Interceptor';

const BASE_URL = '/api/performance-review';

// KPI Questions Management
export const createKPIQuestion = async (data: CreateKPIQuestionRequest): Promise<KPIQuestion> => {
  const response = await API.post(`${BASE_URL}/questions`, data);
  return response.data;
};

export const getKPIQuestions = async (): Promise<KPIQuestion[]> => {
  const response = await API.get(`${BASE_URL}/questions`);
  return response.data;
};

export const updateKPIQuestion = async (id: string, data: Partial<CreateKPIQuestionRequest>): Promise<KPIQuestion> => {
  const response = await API.put(`${BASE_URL}/questions/${id}`, data);
  return response.data;
};

export const deleteKPIQuestion = async (id: string): Promise<{ message: string }> => {
  const response = await API.delete(`${BASE_URL}/questions/${id}`);
  return response.data;
};

// Review Requests Management
export const createReviewRequest = async (data: CreateReviewRequestRequest): Promise<ReviewRequest> => {
  const response = await API.post(`${BASE_URL}/requests`, data);
  return response.data;
};

export const getReviewRequests = async (): Promise<ReviewRequest[]> => {
  const response = await API.get(`${BASE_URL}/requests`);
  return response.data;
};

export const getReviewRequestById = async (id: string): Promise<ReviewRequest> => {
  const response = await API.get(`${BASE_URL}/requests/${id}`);
  return response.data;
};

export const updateReviewRequest = async (id: string, data: Partial<CreateReviewRequestRequest>): Promise<ReviewRequest> => {
  const response = await API.put(`${BASE_URL}/requests/${id}`, data);
  return response.data;
};

export const deleteReviewRequest = async (id: string): Promise<{ message: string }> => {
  const response = await API.delete(`${BASE_URL}/requests/${id}`);
  return response.data;
};

// Review Submissions
export const submitReview = async (data: CreateReviewRequest): Promise<Review> => {
  const response = await API.post(`${BASE_URL}/reviews`, data);
  return response.data;
};

export const saveReviewDraft = async (data: CreateReviewRequest): Promise<Review> => {
  const response = await API.post(`${BASE_URL}/reviews/draft`, data);
  return response.data;
};

export const getReviews = async (): Promise<Review[]> => {
  const response = await API.get(`${BASE_URL}/reviews`);
  return response.data;
};

export const getReviewById = async (id: string): Promise<Review> => {
  const response = await API.get(`${BASE_URL}/reviews/${id}`);
  return response.data;
};

export const getReviewsByRequest = async (requestId: string): Promise<Review[]> => {
  const response = await API.get(`${BASE_URL}/reviews/request/${requestId}`);
  return response.data;
};
