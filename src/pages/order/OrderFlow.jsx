import { useState } from "react"
import Step1 from "./steps/Step1"
import Step2 from "./steps/Step2"
import Step3 from "./steps/Step3"
import Step4 from "./steps/Step4"

const steps = [Step1, Step2, Step3, Step4]
const stepTitles = ["The Group", "Restrictions", "Recommendations", "Confirm"]

export default function OrderFlow() {
  const [currentStep, setCurrentStep] = useState(0)

  const StepComponent = steps[currentStep]

  function next() {
    setCurrentStep(s => Math.min(s + 1, steps.length - 1))
  }

  function back() {
    setCurrentStep(s => Math.max(s - 1, 0))
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Progress */}
      <div className="flex gap-2">
        {stepTitles.map((title, i) => (
          <div
            key={i}
            className={`flex-1 text-center text-xs py-1 border-b-2 transition-colors ${
              i === currentStep
                ? "border-black text-black font-semibold"
                : i < currentStep
                ? "border-gray-400 text-gray-400"
                : "border-gray-200 text-gray-300"
            }`}
          >
            {title}
          </div>
        ))}
      </div>

      {/* Step content */}
      <StepComponent />

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-100">
        {currentStep > 0 ? (
          <button
            onClick={back}
            className="px-6 py-2 border border-gray-300 rounded font-zodiak hover:border-black transition-colors"
          >
            Back
          </button>
        ) : <div />}

        {currentStep < steps.length - 1 && (
          <button
            onClick={next}
            className="px-6 py-2 bg-black text-white rounded font-zodiak hover:bg-gray-900 transition-colors"
          >
            Next
          </button>
        )}
      </div>

    </div>
  )
}