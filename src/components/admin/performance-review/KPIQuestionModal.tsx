'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateKPIQuestion } from '@/hooks/usePerformanceReview';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

type KPIQuestionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onQuestionCreated: () => void;
  existingCategories: string[];
};

const KPIQuestionModal: React.FC<KPIQuestionModalProps> = ({
  isOpen,
  onClose,
  onQuestionCreated,
  existingCategories,
}) => {
  const [formData, setFormData] = useState({
    question: '',
    category: '',
    questionType: 'text' as 'text' | 'yes_no' | 'rating',
  });
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const createKPIQuestionMutation = useCreateKPIQuestion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = isCreatingNewCategory ? newCategory : formData.category;

    if (!formData.question.trim() || !finalCategory.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createKPIQuestionMutation.mutateAsync({
        ...formData,
        category: finalCategory,
      });
      setFormData({ question: '', category: '', questionType: 'text' });
      setNewCategory('');
      setIsCreatingNewCategory(false);
      onQuestionCreated();
      onClose();
    } catch (error) {
      // Error handling is done in the hook
      console.error('Error creating KPI question:', error);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'new') {
      setIsCreatingNewCategory(true);
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setIsCreatingNewCategory(false);
      setFormData(prev => ({ ...prev, category: value }));
      setNewCategory('');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary-100">Create New KPI Question</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="size-8 p-0"
          >
            <X className="size-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Input
              id="question"
              placeholder="Enter your KPI question"
              value={formData.question}
              onChange={e => setFormData(prev => ({ ...prev, question: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={isCreatingNewCategory ? 'new' : formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select or create a category" />
              </SelectTrigger>
              <SelectContent>
                {existingCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
                <SelectItem value="new">+ Create New Category</SelectItem>
              </SelectContent>
            </Select>
            {isCreatingNewCategory && (
              <Input
                placeholder="Enter new category name"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                required
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="questionType">Question Type *</Label>
            <Select
              value={formData.questionType}
              onValueChange={(value: 'text' | 'yes_no' | 'rating') =>
                setFormData(prev => ({ ...prev, questionType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Response</SelectItem>
                <SelectItem value="yes_no">Yes/No</SelectItem>
                <SelectItem value="rating">Rating Scale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={createKPIQuestionMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createKPIQuestionMutation.isPending}
            >
              {createKPIQuestionMutation.isPending ? 'Creating...' : 'Create Question'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KPIQuestionModal;
