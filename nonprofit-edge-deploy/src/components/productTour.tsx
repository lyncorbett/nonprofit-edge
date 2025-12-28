import { useState, useEffect } from 'react'

// ============================================
// PRODUCT TOUR - Guided Walkthrough
// Optional 5-step tour for new members
// Brand Colors: Navy #1a365d | Teal #00a0b0
// ============================================

const NAVY = '#1a365d'
const TEAL = '#00a0b0'

interface TourStep {
  id: string
  target: string // CSS selector or element ID
  title: string
  content: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

interface ProductTourProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const tourSteps: TourStep[] = [
  {
    id: 'tools',
    target: 'tools-section',
    title: 'Your Strategic Tools',
    content: "These are your strategic tools. Each one helps you assess and strengthen a different area of your organization — from board governance to strategic planning.",
    position: 'bottom'
  },
  {
    id: 'library',
    target: 'sidebar-library',
    title: 'Resource Library',
    content: "Templates, playbooks, book summaries, and guides live here. 265+ resources ready to download and customize for your organization.",
    position: 'right'
  },
  {
    id: 'events',
    target: 'sidebar-events',
    title: 'Live Events',
    content: "Join live webinars, workshops, and Q&A sessions with Dr. Corbett and other nonprofit experts. Learn alongside peers facing similar challenges.",
    position: 'right'
  },
  {
    id: 'professor',
    target: 'professor-card',
    title: 'Ask the Professor',
    content: "Need a thinking partner? Ask the Professor anything about nonprofit leadership, strategy, board governance, or fundraising. It's like having an expert on call 24/7.",
    position: 'left'
  },
  {
    id: 'chatbot',
    target: 'chatbot-button',
    title: "I'm Here to Help",
    content: "Anytime you need help navigating or have a quick question, just click this button. I'm always here to point you in the right direction!",
    position: 'top'
  }
]

const ProductTour: React.FC<ProductTourProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0, rotation: 0 })

  const step = tourSteps[currentStep]
  const isLastStep = currentStep === tourSteps.length - 1
  const isFirstStep = currentStep === 0

  // Calculate tooltip position based on target element
  useEffect(() => {
    if (!isOpen || !step) return

    const calculatePosition = () => {
      const targetEl = document.getElementById(step.target)
      
      if (!targetEl) {
        // Default center position if element not found
        setTooltipPosition({
          top: window.innerHeight / 2 - 100,
          left: window.innerWidth / 2 - 175
        })
        return
      }

      const rect = targetEl.getBoundingClientRect()
      const tooltipWidth = 350
      const tooltipHeight = 180
      const padding = 20

      let top = 0
      let left = 0
      let arrowTop = 0
      let arrowLeft = 0
      let rotation = 0

      switch (step.position) {
        case 'bottom':
          top = rect.bottom + padding
          left = rect.left + rect.width / 2 - tooltipWidth / 2
          arrowTop = rect.bottom + 5
          arrowLeft = rect.left + rect.width / 2 - 10
          rotation = -90
          break
        case 'top':
          top = rect.top - tooltipHeight - padding
          left = rect.left + rect.width / 2 - tooltipWidth / 2
          arrowTop = rect.top - padding + 5
          arrowLeft = rect.left + rect.width / 2 - 10
          rotation = 90
          break
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.right + padding
          arrowTop = rect.top + rect.height / 2 - 10
          arrowLeft = rect.right + 5
          rotation = 180
          break
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.left - tooltipWidth - padding
          arrowTop = rect.top + rect.height / 2 - 10
          arrowLeft = rect.left - padding + 5
          rotation = 0
          break
      }

      // Keep tooltip within viewport
      if (left < 20) left = 20
      if (left + tooltipWidth > window.innerWidth - 20) left = window.innerWidth - tooltipWidth - 20
      if (top < 20) top = 20
      if (top + tooltipHeight > window.innerHeight - 20) top = window.innerHeight - tooltipHeight - 20

      setTooltipPosition({ top, left })
      setArrowPosition({ top: arrowTop, left: arrowLeft, rotation })

      // Highlight the target element
      targetEl.style.position = 'relative'
      targetEl.style.zIndex = '1001'
      targetEl.style.boxShadow = `0 0 0 4px ${TEAL}, 0 0 20px rgba(0, 160, 176, 0.4)`
      targetEl.style.borderRadius = '12px'
    }

    calculatePosition()

    // Cleanup previous highlights
    return () => {
      tourSteps.forEach(s => {
        const el = document.getElementById(s.target)
        if (el) {
          el.style.zIndex = ''
          el.style.boxShadow = ''
          el.style.position = ''
        }
      })
    }
  }, [isOpen, currentStep, step])

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-[1000]"
        onClick={handleSkip}
      />

      {/* Arrow pointing to element */}
      <div
        className="fixed z-[1002] text-4xl transition-all duration-300"
        style={{
          top: arrowPosition.top,
          left: arrowPosition.left,
          transform: `rotate(${arrowPosition.rotation}deg)`,
          color: TEAL
        }}
      >
        ➤
      </div>

      {/* Tooltip */}
      <div
        className="fixed z-[1002] w-[350px] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left
        }}
      >
        {/* Header */}
        <div 
          className="px-5 py-3 flex items-center justify-between"
          style={{ backgroundColor: NAVY }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🎓</span>
            <span className="text-white font-semibold text-sm">{step.title}</span>
          </div>
          <span className="text-white/60 text-xs">
            {currentStep + 1} of {tourSteps.length}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {step.content}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-4">
            {tourSteps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentStep ? 'w-6' : ''
                }`}
                style={{ 
                  backgroundColor: idx === currentStep ? TEAL : '#e5e7eb'
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Skip tour
            </button>
            
            <div className="flex gap-2">
              {!isFirstStep && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                  style={{ color: NAVY }}
                >
                  ← Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition"
                style={{ backgroundColor: TEAL }}
              >
                {isLastStep ? 'Finish Tour 🎉' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductTour
