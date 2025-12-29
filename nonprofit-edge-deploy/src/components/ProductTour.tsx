/**
 * THE NONPROFIT EDGE - Product Tour
 * Guided walkthrough with Next/Back buttons and progress indicator
 */

import React, { useState, useEffect } from 'react';

const NAVY = '#1a365d';
const TEAL = '#00a0b0';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface ProductTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const tourSteps: TourStep[] = [
  {
    target: 'tools-section',
    title: 'Your Strategic Tools',
    content: 'Access powerful assessments and planning tools designed specifically for nonprofit leaders. Each tool provides actionable insights.',
    position: 'top'
  },
  {
    target: 'sidebar-library',
    title: 'Resource Library',
    content: 'Browse 147+ templates, guides, and book summaries curated for nonprofit professionals.',
    position: 'right'
  },
  {
    target: 'sidebar-events',
    title: 'Live Events & Webinars',
    content: 'Join live workshops, training sessions, and community events to learn alongside other nonprofit leaders.',
    position: 'right'
  },
  {
    target: 'professor-card',
    title: 'Ask the Professor',
    content: 'Your AI-powered strategic advisor. Get expert guidance on governance, planning, and leadership challenges anytime.',
    position: 'left'
  },
  {
    target: 'chatbot-button',
    title: 'Need Help?',
    content: 'Click the help button anytime to get quick assistance navigating the platform or finding resources.',
    position: 'left'
  }
];

const ProductTour: React.FC<ProductTourProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const updatePosition = () => {
      const step = tourSteps[currentStep];
      const element = document.getElementById(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Element not found - show tooltip in center of screen
        setTargetRect(null);
      }
    };

    // Small delay to let page render
    const timer = setTimeout(updatePosition, 100);
    window.addEventListener('resize', updatePosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const padding = 16;
    const tooltipWidth = 320;
    const tooltipHeight = 200;

    switch (step.position) {
      case 'top':
        return {
          top: targetRect.top - tooltipHeight - padding,
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
        };
      case 'bottom':
        return {
          top: targetRect.bottom + padding,
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
        };
      case 'left':
        return {
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.left - tooltipWidth - padding,
        };
      case 'right':
        return {
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.right + padding,
        };
      default:
        return { top: '50%', left: '50%' };
    }
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={handleSkip}
      />

      {/* Spotlight on target element */}
      {targetRect && (
        <div
          className="absolute bg-transparent border-4 border-white rounded-xl shadow-2xl"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.6), 0 0 30px rgba(0,160,176,0.5)',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{
          ...getTooltipStyle(),
          width: 320,
          zIndex: 10000
        }}
      >
        {/* Header */}
        <div 
          className="px-5 py-3 flex items-center justify-between"
          style={{ backgroundColor: NAVY }}
        >
          <h3 className="text-white font-bold text-sm">{step.title}</h3>
          <button
            onClick={handleSkip}
            className="text-white/70 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {step.content}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-4">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'w-6' 
                    : index < currentStep 
                      ? 'bg-gray-300' 
                      : 'bg-gray-200'
                }`}
                style={{ 
                  backgroundColor: index === currentStep ? TEAL : undefined 
                }}
              />
            ))}
          </div>

          {/* Step Counter */}
          <div className="text-center text-xs text-gray-400 mb-4">
            Step {currentStep + 1} of {tourSteps.length}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            {!isFirstStep && (
              <button
                onClick={handleBack}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                ← Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-bold text-white transition hover:opacity-90"
              style={{ backgroundColor: TEAL }}
            >
              {isLastStep ? '✓ Finish Tour' : 'Next →'}
            </button>
          </div>

          {/* Skip Link */}
          <button
            onClick={handleSkip}
            className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600"
          >
            Skip tour
          </button>
        </div>

        {/* Completion Message for Last Step */}
        {isLastStep && (
          <div 
            className="px-5 py-3 text-center text-xs"
            style={{ backgroundColor: TEAL_LIGHT, color: TEAL }}
          >
            🎉 You're all set! Start exploring your tools.
          </div>
        )}
      </div>
    </div>
  );
};

const TEAL_LIGHT = '#e6f7f9';

export default ProductTour;
