'use client';

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ValidationData {
  validationScore: number;
  strengths: string[];
  challenges: string[];
  suggestions: string[];
  marketPotential: string;
}

interface ValidationResultsProps {
  validation: ValidationData | null;
  isLoading?: boolean;
  error?: string | null;
}

export default function ValidationResults({
  validation,
  isLoading = false,
  error = null,
}: ValidationResultsProps) {
  if (!validation && !isLoading && !error) {
    return null;
  }

  if (isLoading) {
    return (
      <Alert className="border-l-4 border-l-[var(--mustard)] bg-[var(--card-cream)] mb-6">
        <AlertDescription className="text-[var(--vintage-text)] font-[var(--font-courier-prime)]">
          🤖 AI is analyzing your idea...
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert className="border-l-4 border-l-[var(--hot-red)] bg-[var(--card-cream)] mb-6">
        <AlertDescription className="text-[var(--hot-red)] font-[var(--font-courier-prime)]">
          ⚠️ {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!validation) {
    return null;
  }

  const scoreColor =
    validation.validationScore >= 75
      ? 'text-[var(--forest-green)]'
      : validation.validationScore >= 50
        ? 'text-[var(--mustard)]'
        : 'text-[var(--hot-red)]';

  return (
    <Card className="mb-6 border-2 border-[var(--cork-bg)] bg-[var(--card-cream)] shadow-md">
      <CardHeader className="pb-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <CardTitle className="font-[var(--font-lora)] text-lg text-[var(--vintage-text)]">
            AI Validation Results
          </CardTitle>
          <div className={`text-3xl font-bold ${scoreColor}`}>
            {validation.validationScore}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Market Potential Badge */}
        <div className="flex items-center gap-3">
          <span className="font-[var(--font-courier-prime)] text-sm font-bold text-[var(--vintage-text)]">
            Market Potential:
          </span>
          <span
            className={`px-3 py-1 rounded font-[var(--font-courier-prime)] text-xs font-bold ${
              validation.marketPotential === 'High' ||
              validation.marketPotential === 'Massive'
                ? 'bg-[var(--forest-green)] text-[var(--card-cream)]'
                : validation.marketPotential === 'Medium' ||
                    validation.marketPotential === 'Moderate'
                  ? 'bg-[var(--mustard)] text-[var(--vintage-text)]'
                  : 'bg-[var(--olive-grey)] text-[var(--card-cream)]'
            }`}
          >
            {validation.marketPotential}
          </span>
        </div>

        {/* Strengths */}
        {validation.strengths && validation.strengths.length > 0 && (
          <div>
            <h4 className="font-[var(--font-courier-prime)] text-sm font-bold text-[var(--forest-green)] mb-2">
              ✓ Strengths:
            </h4>
            <ul className="space-y-1">
              {validation.strengths.map((strength, idx) => (
                <li
                  key={idx}
                  className="text-sm text-[var(--vintage-text)] font-[var(--font-lora)] ml-4"
                >
                  • {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Challenges */}
        {validation.challenges && validation.challenges.length > 0 && (
          <div>
            <h4 className="font-[var(--font-courier-prime)] text-sm font-bold text-[var(--hot-red)] mb-2">
              ⚠ Challenges:
            </h4>
            <ul className="space-y-1">
              {validation.challenges.map((challenge, idx) => (
                <li
                  key={idx}
                  className="text-sm text-[var(--vintage-text)] font-[var(--font-lora)] ml-4"
                >
                  • {challenge}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestions */}
        {validation.suggestions && validation.suggestions.length > 0 && (
          <div>
            <h4 className="font-[var(--font-courier-prime)] text-sm font-bold text-[var(--mustard)] mb-2">
              💡 Suggestions:
            </h4>
            <ul className="space-y-1">
              {validation.suggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  className="text-sm text-[var(--vintage-text)] font-[var(--font-lora)] ml-4"
                >
                  • {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
