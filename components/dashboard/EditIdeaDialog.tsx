'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Category, Difficulty, Idea, MarketPotential } from '@/types';
import { useIdeas } from '@/context/IdeaContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FieldGroup, FieldLabel } from '@/components/ui/field';

const CATEGORIES: Category[] = ['Technology', 'Health', 'Finance', 'Education', 'Entertainment', 'Social', 'Commerce', 'Other'];
const DIFFICULTIES: Difficulty[] = [1, 2, 3, 4, 5];
const MARKET_POTENTIALS: MarketPotential[] = ['Low', 'Medium', 'High', 'Massive'];

interface Props {
  idea: Idea;
  trigger: React.ReactNode;
}

export default function EditIdeaDialog({ idea, trigger }: Props) {
  const { updateIdea, ideas } = useIdeas();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const initial = useMemo(
    () => ({
      title: idea.title || '',
      problemStatement: idea.problemStatement || '',
      description: idea.description || idea.problemStatement || '',
      category: (idea.category || '') as Category | '',
      difficulty: (idea.difficulty || '') as Difficulty | '',
      marketPotential: (idea.marketPotential || '') as MarketPotential | '',
    }),
    [idea],
  );

  const [formData, setFormData] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(initial);
      setErrors({});
    }
  }, [open, initial]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.trim().length < 2) newErrors.title = 'Title must be at least 2 characters';
    if (formData.title.trim().length > 100) newErrors.title = 'Title must be less than 100 characters';

    const otherWithSameTitle = ideas.some(
      (i) => i.id !== idea.id && i.title.toLowerCase() === formData.title.trim().toLowerCase(),
    );
    if (otherWithSameTitle) newErrors.title = 'Another idea with this title already exists';

    if (!formData.problemStatement.trim()) newErrors.problemStatement = 'Problem statement is required';
    if (formData.problemStatement.trim().length > 500) newErrors.problemStatement = 'Problem statement must be less than 500 characters';

    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.trim().length > 500) newErrors.description = 'Description must be less than 500 characters';

    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.difficulty) newErrors.difficulty = 'Difficulty is required';
    if (!formData.marketPotential) newErrors.marketPotential = 'Market potential is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ title: 'Validation Error', description: 'Please fix the errors above', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      await updateIdea(idea.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        problemStatement: formData.problemStatement.trim(),
        category: formData.category as Category,
        difficulty: formData.difficulty as Difficulty,
        marketPotential: formData.marketPotential as MarketPotential,
      });
      toast({ title: 'Updated!', description: 'Your idea has been updated.' });
      setOpen(false);
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to update idea.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'var(--font-courier-prime)' }}>EDIT IDEA</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5">
          <FieldGroup>
            <FieldLabel htmlFor={`edit-title-${idea.id}`}>Title</FieldLabel>
            <Input
              id={`edit-title-${idea.id}`}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={100}
              style={{ fontFamily: 'var(--font-courier-prime)' }}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor={`edit-problem-${idea.id}`}>Problem Statement</FieldLabel>
            <Textarea
              id={`edit-problem-${idea.id}`}
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
              maxLength={500}
              rows={3}
              style={{ fontFamily: 'var(--font-lora)' }}
              className={errors.problemStatement ? 'border-red-500' : ''}
            />
            {errors.problemStatement && <p className="text-xs text-red-500 mt-1">{errors.problemStatement}</p>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor={`edit-desc-${idea.id}`}>Description</FieldLabel>
            <Textarea
              id={`edit-desc-${idea.id}`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              maxLength={500}
              rows={3}
              style={{ fontFamily: 'var(--font-lora)' }}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor={`edit-category-${idea.id}`}>Category</FieldLabel>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as Category })}>
              <SelectTrigger id={`edit-category-${idea.id}`} style={{ fontFamily: 'var(--font-courier-prime)' }}>
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

          <FieldGroup>
            <FieldLabel>Difficulty (1=Easy, 5=Insane)</FieldLabel>
            <RadioGroup
              value={formData.difficulty ? String(formData.difficulty) : ''}
              onValueChange={(value) => setFormData({ ...formData, difficulty: parseInt(value) as Difficulty })}
            >
              <div className="flex gap-4 flex-wrap">
                {DIFFICULTIES.map((diff) => (
                  <div key={diff} className="flex items-center gap-2">
                    <RadioGroupItem value={String(diff)} id={`edit-difficulty-${idea.id}-${diff}`} />
                    <label
                      htmlFor={`edit-difficulty-${idea.id}-${diff}`}
                      style={{ fontFamily: 'var(--font-courier-prime)' }}
                      className="text-sm cursor-pointer"
                    >
                      {diff}
                    </label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {errors.difficulty && <p className="text-xs text-red-500 mt-1">{errors.difficulty}</p>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Market Potential</FieldLabel>
            <RadioGroup
              value={formData.marketPotential || ''}
              onValueChange={(value) => setFormData({ ...formData, marketPotential: value as MarketPotential })}
            >
              <div className="flex flex-col gap-3">
                {MARKET_POTENTIALS.map((potential) => (
                  <div key={potential} className="flex items-center gap-2">
                    <RadioGroupItem value={potential} id={`edit-market-${idea.id}-${potential}`} />
                    <label
                      htmlFor={`edit-market-${idea.id}-${potential}`}
                      style={{ fontFamily: 'var(--font-courier-prime)' }}
                      className="text-sm cursor-pointer"
                    >
                      {potential}
                    </label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {errors.marketPotential && <p className="text-xs text-red-500 mt-1">{errors.marketPotential}</p>}
          </FieldGroup>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={saving}
              style={{
                backgroundColor: 'var(--cork-bg)',
                color: 'var(--card-cream)',
                fontFamily: 'var(--font-courier-prime)',
                fontWeight: 'bold',
                letterSpacing: '0.05em',
              }}
            >
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

