'use client';

import React, { useState } from 'react';
import { useIdeas } from '@/context/IdeaContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Category, Difficulty, MarketPotential } from '@/types';
import { Plus } from 'lucide-react';

const CATEGORIES: Category[] = ['Technology', 'Health', 'Finance', 'Education', 'Entertainment', 'Social', 'Commerce', 'Other'];
const DIFFICULTIES: Difficulty[] = [1, 2, 3, 4, 5];
const MARKET_POTENTIALS: MarketPotential[] = ['Low', 'Medium', 'High', 'Massive'];

interface FormData {
  title: string;
  description: string;
  problemStatement: string;
  category: Category | '';
  difficulty: Difficulty | '';
  marketPotential: MarketPotential | '';
  expiryHours: '' | number;
}

export default function IdeaForm() {
  const { addIdea, ideas } = useIdeas();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    problemStatement: '',
    category: '',
    difficulty: '',
    marketPotential: '',
    expiryHours: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  const validateWithAI = async () => {
    if (!formData.title.trim() || !formData.problemStatement.trim() || !formData.description.trim()) {
      toast({
        title: 'Incomplete Form',
        description: 'Please fill in title, problem, and description to validate with AI.',
        variant: 'destructive',
      });
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch('/api/validate-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          problem: formData.problemStatement,
          solution: formData.description,
          targetMarket: formData.category || 'Not specified',
          difficulty: formData.difficulty || 'Not specified',
        }),
      });

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      const data = await response.json();
      setValidationResult(data.validation);

      toast({
        title: 'AI Validation Complete!',
        description: `Your idea scored ${data.validation.validationScore}/100!`,
      });
    } catch (error) {
      toast({
        title: 'Validation Error',
        description: 'Could not validate your idea. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    } else if (ideas.some((idea) => idea.title.toLowerCase() === formData.title.toLowerCase())) {
      newErrors.title = 'An idea with this title already exists';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (!formData.problemStatement.trim()) {
      newErrors.problemStatement = 'Problem statement is required';
    } else if (formData.problemStatement.length > 500) {
      newErrors.problemStatement = 'Problem statement must be less than 500 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.difficulty) {
      newErrors.difficulty = 'Difficulty is required';
    }

    if (!formData.marketPotential) {
      newErrors.marketPotential = 'Market potential is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors above',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addIdea({
        title: formData.title.trim(),
        description: formData.description.trim(),
        problemStatement: formData.problemStatement.trim(),
        category: formData.category as Category,
        difficulty: formData.difficulty as Difficulty,
        marketPotential: formData.marketPotential as MarketPotential,
        expiryHours: formData.expiryHours || undefined,
      });

      toast({
        title: 'Success!',
        description: 'Your startup idea has been submitted!',
      });

      setFormData({
        title: '',
        description: '',
        problemStatement: '',
        category: '',
        difficulty: '',
        marketPotential: '',
        expiryHours: '',
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit idea. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          style={{
            backgroundColor: 'var(--hot-red)',
            color: 'var(--card-cream)',
            fontFamily: 'var(--font-courier-prime)',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
          }}
        >
          <Plus size={16} className="mr-1" />
          NEW IDEA
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'var(--font-courier-prime)' }}>SUBMIT YOUR IDEA</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <FieldGroup>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              placeholder="Your brilliant startup idea..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={100}
              style={{ fontFamily: 'var(--font-courier-prime)' }}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            <p className="text-xs" style={{ color: 'var(--olive-grey)' }}>
              {formData.title.length}/100
            </p>
          </FieldGroup>

          {/* Problem Statement */}
          <FieldGroup>
            <FieldLabel htmlFor="problem">Problem Statement</FieldLabel>
            <Textarea
              id="problem"
              placeholder="What problem does this solve?"
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
              maxLength={500}
              style={{ fontFamily: 'var(--font-lora)' }}
              className={errors.problemStatement ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.problemStatement && <p className="text-xs text-red-500 mt-1">{errors.problemStatement}</p>}
            <p className="text-xs" style={{ color: 'var(--olive-grey)' }}>
              {formData.problemStatement.length}/500
            </p>
          </FieldGroup>

          {/* Description */}
          <FieldGroup>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              placeholder="Describe your solution..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              maxLength={500}
              style={{ fontFamily: 'var(--font-lora)' }}
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            <p className="text-xs" style={{ color: 'var(--olive-grey)' }}>
              {formData.description.length}/500
            </p>
          </FieldGroup>

          {/* Category */}
          <FieldGroup>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as Category })}>
              <SelectTrigger id="category" style={{ fontFamily: 'var(--font-courier-prime)' }}>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </FieldGroup>

          {/* Difficulty */}
          <FieldGroup>
            <FieldLabel>Difficulty (1=Easy, 5=Insane)</FieldLabel>
            <RadioGroup
              value={formData.difficulty ? String(formData.difficulty) : ''}
              onValueChange={(value) => setFormData({ ...formData, difficulty: parseInt(value) as Difficulty })}
            >
              <div className="flex gap-4 flex-wrap">
                {DIFFICULTIES.map((diff) => (
                  <div key={diff} className="flex items-center gap-2">
                    <RadioGroupItem value={String(diff)} id={`difficulty-${diff}`} />
                    <label htmlFor={`difficulty-${diff}`} style={{ fontFamily: 'var(--font-courier-prime)' }} className="text-sm cursor-pointer">
                      {diff}
                    </label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {errors.difficulty && <p className="text-xs text-red-500 mt-1">{errors.difficulty}</p>}
          </FieldGroup>

          {/* Market Potential */}
          <FieldGroup>
            <FieldLabel>Market Potential</FieldLabel>
            <RadioGroup
              value={formData.marketPotential || ''}
              onValueChange={(value) => setFormData({ ...formData, marketPotential: value as MarketPotential })}
            >
              <div className="flex flex-col gap-3">
                {MARKET_POTENTIALS.map((potential) => (
                  <div key={potential} className="flex items-center gap-2">
                    <RadioGroupItem value={potential} id={`market-${potential}`} />
                    <label htmlFor={`market-${potential}`} style={{ fontFamily: 'var(--font-courier-prime)' }} className="text-sm cursor-pointer">
                      {potential}
                    </label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {errors.marketPotential && <p className="text-xs text-red-500 mt-1">{errors.marketPotential}</p>}
          </FieldGroup>

          {/* Optional review duration */}
          <FieldGroup>
            <FieldLabel htmlFor="expiryHours">Review Duration (optional)</FieldLabel>
            <Select
              value={formData.expiryHours === '' ? 'none' : String(formData.expiryHours)}
              onValueChange={(value) =>
                setFormData({ ...formData, expiryHours: value === 'none' ? '' : parseInt(value, 10) })
              }
            >
              <SelectTrigger id="expiryHours" style={{ fontFamily: 'var(--font-courier-prime)' }}>
                <SelectValue placeholder="No expiry (stays on dashboard)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No expiry</SelectItem>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="6">6 hours</SelectItem>
                <SelectItem value="12">12 hours</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="48">48 hours</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs mt-1" style={{ color: 'var(--olive-grey)' }}>
              After this time, the idea moves to Archived automatically.
            </p>
          </FieldGroup>

          {/* AI Validation Section */}
          {validationResult && (
            <div
              className="p-4 rounded-lg space-y-3"
              style={{
                backgroundColor: 'var(--muted)',
                border: '2px solid var(--forest-green)',
              }}
            >
              <div className="flex items-center justify-between">
                <h3
                  style={{
                    fontFamily: 'var(--font-courier-prime)',
                    fontWeight: 'bold',
                    color: 'var(--forest-green)',
                  }}
                >
                  AI VALIDATION REPORT
                </h3>
                <div
                  style={{
                    fontFamily: 'var(--font-courier-prime)',
                    fontWeight: 'bold',
                    color: validationResult.validationScore >= 70 ? 'var(--forest-green)' : validationResult.validationScore >= 50 ? 'var(--mustard)' : 'var(--hot-red)',
                    fontSize: '1.25rem',
                  }}
                >
                  {validationResult.validationScore}/100
                </div>
              </div>

              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-courier-prime)',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: 'var(--forest-green)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Strengths
                </p>
                <ul style={{ fontFamily: 'var(--font-lora)', fontSize: '0.875rem' }} className="list-disc list-inside space-y-1">
                  {validationResult.strengths?.map((item: string, i: number) => (
                    <li key={i} style={{ color: 'var(--vintage-text)' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-courier-prime)',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: 'var(--hot-red)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Challenges
                </p>
                <ul style={{ fontFamily: 'var(--font-lora)', fontSize: '0.875rem' }} className="list-disc list-inside space-y-1">
                  {validationResult.challenges?.map((item: string, i: number) => (
                    <li key={i} style={{ color: 'var(--vintage-text)' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-courier-prime)',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: 'var(--mustard)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Suggestions
                </p>
                <ul style={{ fontFamily: 'var(--font-lora)', fontSize: '0.875rem' }} className="list-disc list-inside space-y-1">
                  {validationResult.suggestions?.map((item: string, i: number) => (
                    <li key={i} style={{ color: 'var(--vintage-text)' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span style={{ fontFamily: 'var(--font-courier-prime)', fontSize: '0.875rem', fontWeight: 'bold' }}>
                  Market Potential: <span style={{ color: 'var(--forest-green)' }}>{validationResult.marketPotential}</span>
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={validateWithAI}
              disabled={isValidating || !formData.title.trim() || !formData.problemStatement.trim() || !formData.description.trim()}
              style={{
                fontFamily: 'var(--font-courier-prime)',
                fontWeight: 'bold',
                letterSpacing: '0.05em',
              }}
            >
              {isValidating ? 'VALIDATING...' : 'VALIDATE WITH AI'}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              style={{
                backgroundColor: 'var(--cork-bg)',
                color: 'var(--card-cream)',
                fontFamily: 'var(--font-courier-prime)',
                fontWeight: 'bold',
                letterSpacing: '0.05em',
              }}
            >
              SUBMIT IDEA
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
