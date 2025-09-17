export type KPIQuestion = {
  _id: string;
  question: string;
  category: string;
  questionType: 'text' | 'yes-no' | 'rating';
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
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
};

export type ReviewAnswer = {
  questionId: string;
  answer: string;
  additionalComments?: string;
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
  answers: ReviewAnswer[];
  comments: string;
  status: 'DRAFT' | 'SUBMITTED';
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateKPIQuestionRequest = {
  question: string;
  category: string;
  questionType: 'text' | 'yes-no' | 'rating';
};

export type CreateReviewRequestRequest = {
  title: string;
  dueDate: Date;
  revieweeId: string;
  assignedReviewers: string[];
  kpiQuestions: string[];
};

export type CreateReviewRequest = {
  reviewRequestId: string;
  answers: ReviewAnswer[];
  comments: string;
};
