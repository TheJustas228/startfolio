'use client';

/**
 * Onboarding questionnaire screen.
 *
 * Asks exactly 5 questions, computes a risk score, and shows a
 * recommendation screen. Uses a calm step indicator (dots).
 */

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { QUESTIONS } from '@/data/questions';
import { useAppContext } from '@/context/AppContext';
import { getPortfolioById } from '@/data/portfolios';
import StepIndicator from '@/components/StepIndicator';
import styles from './page.module.css';

export default function OnboardingPage() {
  const router = useRouter();
  const {
    answers,
    setAnswer,
    completeOnboarding,
    recommendation,
    onboardingComplete,
  } = useAppContext();

  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const totalSteps = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentStep];

  const canProceed = answers[currentQuestion?.id] !== undefined;
  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Complete onboarding
      completeOnboarding();
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  // Recommendation screen
  if (showResult && recommendation) {
    const portfolio = getPortfolioById(recommendation.portfolioId);
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.resultCard}>
            <div className={styles.resultIcon}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="var(--primary-soft)" />
                <path
                  d="M16 24L22 30L34 18"
                  stroke="var(--primary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className={styles.resultTitle}>Recommended starting point</h2>
            <h3
              className={styles.portfolioName}
              style={{ color: portfolio?.accent }}
            >
              {portfolio?.name}
            </h3>
            <p className={styles.resultExplanation}>
              {recommendation.explanation}
            </p>
            <div className={styles.resultActions}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() =>
                  router.push(`/portfolios/${recommendation.portfolioId}`)
                }
              >
                See recommended portfolio
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => router.push('/portfolios')}
              >
                Compare all portfolios
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => router.push('/')}
          >
            ← Back
          </button>
          <StepIndicator total={totalSteps} current={currentStep} />
        </div>

        {/* Question card */}
        <div className={styles.questionCard}>
          <h2 className={styles.questionText}>{currentQuestion.text}</h2>

          <div className={styles.options}>
            {currentQuestion.type === 'slider' ? (
              /* Worst-year comfort — rendered as choice buttons for clarity */
              currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`${styles.option} ${
                    answers[currentQuestion.id] === idx ? styles.optionActive : ''
                  }`}
                  onClick={() => setAnswer(currentQuestion.id, idx)}
                >
                  {opt.label}
                </button>
              ))
            ) : (
              currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`${styles.option} ${
                    answers[currentQuestion.id] === idx ? styles.optionActive : ''
                  }`}
                  onClick={() => setAnswer(currentQuestion.id, idx)}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className={styles.nav}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleBack}
            disabled={currentStep === 0}
            style={{ opacity: currentStep === 0 ? 0.4 : 1 }}
          >
            ← Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!canProceed}
            style={{ opacity: canProceed ? 1 : 0.5 }}
          >
            {currentStep < totalSteps - 1 ? 'Next' : 'See my recommendation'}
          </button>
        </div>
      </div>
    </main>
  );
}
