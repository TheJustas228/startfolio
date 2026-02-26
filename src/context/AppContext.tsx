'use client';

/**
 * Global application state for StartFolio.
 *
 * Stores:
 *   - Onboarding answers and computed risk score
 *   - Selected portfolio id
 *   - Recommended portfolio id and default slider
 *   - Current slider value
 *   - Customized allocations
 *   - Inflation-diversifier toggle state
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { PortfolioAllocation } from '@/data/portfolios';
import { computeRiskScore, getRecommendation, Recommendation } from '@/data/questions';

interface AppState {
  /** Onboarding answers: questionId → option index */
  answers: Record<string, number>;
  /** Computed risk score 0–100 */
  riskScore: number | null;
  /** Recommendation from onboarding */
  recommendation: Recommendation | null;
  /** Currently selected portfolio id */
  selectedPortfolioId: string | null;
  /** Current slider value 0–100 */
  sliderValue: number;
  /** Whether "Include inflation diversifiers" toggle is on */
  includeInflationDiversifiers: boolean;
  /** Customized allocations (computed from slider) */
  customAllocations: PortfolioAllocation[] | null;
  /** Whether onboarding is completed */
  onboardingComplete: boolean;
}

interface AppContextType extends AppState {
  setAnswer: (questionId: string, optionIndex: number) => void;
  completeOnboarding: () => void;
  selectPortfolio: (portfolioId: string) => void;
  setSliderValue: (value: number) => void;
  setIncludeInflationDiversifiers: (value: boolean) => void;
  setCustomAllocations: (allocations: PortfolioAllocation[]) => void;
  resetToRecommended: () => void;
  resetAll: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [sliderValue, setSliderValueState] = useState<number>(50);
  const [includeInflationDiversifiers, setIncludeInflationDiversifiers] = useState(false);
  const [customAllocations, setCustomAllocations] = useState<PortfolioAllocation[] | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const setAnswer = useCallback((questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }, []);

  const completeOnboarding = useCallback(() => {
    const score = computeRiskScore(answers);
    const rec = getRecommendation(score);
    setRiskScore(score);
    setRecommendation(rec);
    setSelectedPortfolioId(rec.portfolioId);
    setSliderValueState(rec.sliderDefault);
    setOnboardingComplete(true);
  }, [answers]);

  const selectPortfolio = useCallback((portfolioId: string) => {
    setSelectedPortfolioId(portfolioId);
    // Reset slider to recommendation default if available, else 50
    setSliderValueState((prev) => {
      if (recommendation && recommendation.portfolioId === portfolioId) {
        return recommendation.sliderDefault;
      }
      return 50;
    });
    setCustomAllocations(null);
  }, [recommendation]);

  const setSliderValue = useCallback((value: number) => {
    setSliderValueState(value);
  }, []);

  const resetToRecommended = useCallback(() => {
    if (recommendation) {
      setSelectedPortfolioId(recommendation.portfolioId);
      setSliderValueState(recommendation.sliderDefault);
      setCustomAllocations(null);
      setIncludeInflationDiversifiers(false);
    }
  }, [recommendation]);

  const resetAll = useCallback(() => {
    setAnswers({});
    setRiskScore(null);
    setRecommendation(null);
    setSelectedPortfolioId(null);
    setSliderValueState(50);
    setIncludeInflationDiversifiers(false);
    setCustomAllocations(null);
    setOnboardingComplete(false);
  }, []);

  return (
    <AppContext.Provider
      value={{
        answers,
        riskScore,
        recommendation,
        selectedPortfolioId,
        sliderValue,
        includeInflationDiversifiers,
        customAllocations,
        onboardingComplete,
        setAnswer,
        completeOnboarding,
        selectPortfolio,
        setSliderValue,
        setIncludeInflationDiversifiers,
        setCustomAllocations,
        resetToRecommended,
        resetAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return ctx;
}
