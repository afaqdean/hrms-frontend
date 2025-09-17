'use client';

import type { KPIQuestion } from '@/hooks/usePerformanceReview';
import type { CreateReviewRequestRequest } from '@/interfaces/PerformanceReview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import useEmployees from '@/hooks/useEmployees';
import { useCreateReviewRequest, useKPIQuestions } from '@/hooks/usePerformanceReview';
import { format } from 'date-fns';
import { Check, Plus, Search, User, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import KPIQuestionModal from './KPIQuestionModal';

type CreateReviewRequestProps = {
  employeeId: string;
  employeeName: string;
  onCloseAction: () => void;
};

export default function CreateReviewRequest({
  employeeId,
  employeeName,
  onCloseAction,
}: CreateReviewRequestProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateReviewRequestRequest>({
    title: '',
    dueDate: new Date(),
    revieweeId: employeeId,
    assignedReviewers: [],
    kpiQuestions: [],
  });

  const [selectedQuestions, setSelectedQuestions] = useState<KPIQuestion[]>([]);
  const [isKPIModalOpen, setIsKPIModalOpen] = useState(false);
  const [reviewerSearchTerm, setReviewerSearchTerm] = useState('');
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);

  const { data: kpiQuestions = [], refetch: loadKPIQuestions } = useKPIQuestions();
  const { Employees: employees = [], isLoading: employeesLoading } = useEmployees();
  const createReviewRequestMutation = useCreateReviewRequest();

  // Filter employees based on search term and exclude the current employee
  const filteredEmployees = useMemo(() => {
    if (!employees) {
      return [];
    }
    return employees.filter(employee =>
      employee._id !== employeeId
      && (employee.name.toLowerCase().includes(reviewerSearchTerm.toLowerCase())
        || employee.employeeID.toLowerCase().includes(reviewerSearchTerm.toLowerCase())
        || employee.position.toLowerCase().includes(reviewerSearchTerm.toLowerCase())),
    );
  }, [employees, reviewerSearchTerm, employeeId]);

  // Handle reviewer selection
  const handleReviewerToggle = (reviewerId: string) => {
    setSelectedReviewers(prev =>
      prev.includes(reviewerId)
        ? prev.filter(id => id !== reviewerId)
        : [...prev, reviewerId],
    );
  };

  // Update form data when reviewers change
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, assignedReviewers: selectedReviewers }));
  }, [selectedReviewers]);

  const handleNext = () => {
    if (currentStep < 3) {
      // Validate current step before proceeding
      if (currentStep === 1 && !formData.title.trim()) {
        toast.error('Please enter a review title');
        return;
      }
      if (currentStep === 2 && selectedQuestions.length === 0) {
        toast.error('Please select at least one KPI question');
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuestionSelect = (question: KPIQuestion) => {
    if (selectedQuestions.find(q => q._id === question._id)) {
      setSelectedQuestions(selectedQuestions.filter(q => q._id !== question._id));
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleQuestionRemove = (questionId: string) => {
    setSelectedQuestions(selectedQuestions.filter(q => q._id !== questionId));
  };

  const handleSubmit = async () => {
    try {
      await createReviewRequestMutation.mutateAsync({
        ...formData,
        dueDate: formData.dueDate.toISOString(),
        kpiQuestions: selectedQuestions.map(q => q._id),
      });
      onCloseAction();
    } catch (error) {
      // Error handling is done in the hook
      console.error('Error creating review request:', error);
    }
  };

  const progress = (currentStep / 3) * 100;

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
              <Plus className="size-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-100">Create Review Request</h1>
              <p className="mt-1 text-sm text-gray-600">
                Employee:
                {' '}
                <span className="text-base font-semibold text-gray-900">{employeeName}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-900">
                Step
                {' '}
                {currentStep}
                {' '}
                of 3
              </span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                {Math.round(progress)}
                % Complete
              </span>
            </div>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-3 bg-gray-100" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
              {[1, 2, 3].map(step => (
                <div
                  key={step}
                  className={`flex size-6 items-center justify-center rounded-full border-2 text-xs font-medium ${
                    step <= currentStep
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {step < currentStep ? '✓' : step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="p-10">
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
                  <div className="flex size-8 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <h2 className="text-xl font-bold text-primary-100">Basic Details</h2>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Review Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Q1 Performance Review"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={format(formData.dueDate, 'yyyy-MM-dd')}
                    onChange={e => setFormData({ ...formData, dueDate: new Date(e.target.value) })}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Question Selection */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-sm font-bold text-blue-600">2</span>
                    </div>
                    <h2 className="text-xl font-bold text-primary-100">Select Questions</h2>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setIsKPIModalOpen(true)}
                    size="sm"
                    className="bg-blue-600 text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg"
                  >
                    <Plus className="mr-2 size-4" />
                    Add New Question
                  </Button>
                </div>

                {/* Existing Questions */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Available Questions</h3>
                  <div className="max-h-60 space-y-2 overflow-y-auto">
                    {kpiQuestions.map(question => (
                      <button
                        key={question._id}
                        type="button"
                        className={`w-full cursor-pointer rounded-lg border p-3 text-left transition-colors ${
                          selectedQuestions.find(q => q._id === question._id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleQuestionSelect(question)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleQuestionSelect(question);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{question.question}</p>
                            <div className="mt-1 flex gap-2">
                              <Badge variant="secondary">{question.category}</Badge>
                              <Badge variant="outline">{question.questionType}</Badge>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Questions */}
                {selectedQuestions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700">
                      Selected Questions (
                      {selectedQuestions.length}
                      )
                    </h3>
                    <div className="space-y-2">
                      {selectedQuestions.map(question => (
                        <div key={question._id} className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900">{question.question}</p>
                              <div className="mt-1 flex gap-2">
                                <Badge variant="secondary">{question.category}</Badge>
                                <Badge variant="outline">{question.questionType}</Badge>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuestionRemove(question._id)}
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Assign Reviewers */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
                  <div className="flex size-8 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-sm font-bold text-blue-600">3</span>
                  </div>
                  <h2 className="text-xl font-bold text-primary-100">Assign Reviewers</h2>
                </div>

                {/* Search Bar */}
                <div className="space-y-2">
                  <Label htmlFor="reviewerSearch">Search Employees</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="reviewerSearch"
                      placeholder="Search by name, ID, or position..."
                      value={reviewerSearchTerm}
                      onChange={e => setReviewerSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Selected Reviewers */}
                {selectedReviewers.length > 0 && (
                  <div className="space-y-2">
                    <Label>
                      Selected Reviewers (
                      {selectedReviewers.length}
                      )
                    </Label>
                    <div className="space-y-2">
                      {selectedReviewers.map((reviewerId) => {
                        const reviewer = employees?.find(emp => emp._id === reviewerId);
                        if (!reviewer) {
                          return null;
                        }

                        return (
                          <div key={reviewerId} className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
                            <div className="flex items-center gap-3">
                              <div className="flex size-8 items-center justify-center rounded-full bg-blue-100">
                                <User className="size-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{reviewer.name}</p>
                                <p className="text-sm text-gray-600">
                                  {reviewer.employeeID}
                                  {' '}
                                  •
                                  {reviewer.position}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReviewerToggle(reviewerId)}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Available Employees */}
                <div className="space-y-2">
                  <Label>Available Employees</Label>
                  {employeesLoading
                    ? (
                        <div className="py-8 text-center text-gray-500">
                          <p>Loading employees...</p>
                        </div>
                      )
                    : filteredEmployees.length === 0
                      ? (
                          <div className="py-8 text-center text-gray-500">
                            <p>No employees found matching your search.</p>
                          </div>
                        )
                      : (
                          <div className="max-h-60 space-y-2 overflow-y-auto">
                            {filteredEmployees.map(employee => (
                              <button
                                key={employee._id}
                                type="button"
                                className={`w-full cursor-pointer rounded-lg border p-3 text-left transition-colors ${
                                  selectedReviewers.includes(employee._id)
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                                onClick={() => handleReviewerToggle(employee._id)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleReviewerToggle(employee._id);
                                  }
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="flex size-8 items-center justify-center rounded-full bg-gray-100">
                                      <User className="size-4 text-gray-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900">{employee.name}</p>
                                      <p className="text-sm text-gray-600">
                                        {employee.employeeID}
                                        {' '}
                                        •
                                        {employee.position}
                                      </p>
                                    </div>
                                  </div>
                                  {selectedReviewers.includes(employee._id) && (
                                    <Check className="size-5 text-green-600" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="border-t bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="border-gray-300 bg-white shadow-sm hover:bg-gray-50"
                  >
                    ← Previous
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={onCloseAction}
                  className="border-gray-300 bg-white shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>

              <div className="flex gap-3">
                {currentStep < 3
                  ? (
                      <Button
                        onClick={handleNext}
                        className="bg-blue-600 text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg"
                      >
                        Next →
                      </Button>
                    )
                  : (
                      <Button
                        onClick={handleSubmit}
                        disabled={createReviewRequestMutation.isPending}
                        className="bg-green-600 text-white shadow-md transition-all duration-200 hover:bg-green-700 hover:shadow-lg"
                      >
                        {createReviewRequestMutation.isPending ? 'Creating...' : '✓ Create Request'}
                      </Button>
                    )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          {/* View All Requests button removed - now in page header */}
        </div>
      </div>

      {/* KPI Question Modal */}
      <KPIQuestionModal
        isOpen={isKPIModalOpen}
        onClose={() => setIsKPIModalOpen(false)}
        onQuestionCreated={loadKPIQuestions}
        existingCategories={Array.from(new Set(kpiQuestions.map(q => q.category)))}
      />
    </div>
  );
}
