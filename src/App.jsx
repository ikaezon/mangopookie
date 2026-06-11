import { useCallback, useState } from 'react'
import { Celebration } from './components/Celebration'
import { JourneyShell } from './screens/JourneyShell'
import { WelcomeScreen } from './screens/WelcomeScreen'
import { ReadyScreen } from './screens/ReadyScreen'
import { FridayScreen } from './screens/FridayScreen'
import { SaturdayScreen } from './screens/SaturdayScreen'
import { DateAskScreen } from './screens/DateAskScreen'
import { recipient } from './config/content'
import { STORY_STEPS, dateAsk } from './config/journey'
import { useJourneyNavigation } from './hooks/useJourneyNavigation'
import {
  getFridayPickLabels,
  getSaturdayPickLabels,
} from './lib/journeySelections'

export default function App() {
  const [step, setStep] = useState(STORY_STEPS[0])
  const [confirmedDetails, setConfirmedDetails] = useState(null)
  const [fridaySelectedIds, setFridaySelectedIds] = useState(() => new Set())
  const [saturdaySelectedIds, setSaturdaySelectedIds] = useState(() => new Set())

  const { goBack, goNext, stepIndex } = useJourneyNavigation({
    step,
    setStep,
    fridaySelectedIds,
    saturdaySelectedIds,
    setSaturdaySelectedIds,
  })

  const handleYes = useCallback(
    (animationLocked = false) => {
      if (animationLocked) return
      setConfirmedDetails({
        fridayPicks: getFridayPickLabels(fridaySelectedIds),
        saturdayPicks: getSaturdayPickLabels(saturdaySelectedIds),
      })
    },
    [fridaySelectedIds, saturdaySelectedIds],
  )

  const handleRestart = () => {
    setConfirmedDetails(null)
    setFridaySelectedIds(new Set())
    setSaturdaySelectedIds(new Set())
    setStep(STORY_STEPS[0])
  }

  const renderStep = useCallback(
    (currentStep) => {
      switch (currentStep) {
        case 'welcome':
          return <WelcomeScreen />
        case 'ready':
          return <ReadyScreen />
        case 'friday':
          return (
            <FridayScreen
              selectedIds={fridaySelectedIds}
              onSelectionChange={setFridaySelectedIds}
            />
          )
        case 'saturday':
          return (
            <SaturdayScreen
              selectedIds={saturdaySelectedIds}
              onSelectionChange={setSaturdaySelectedIds}
            />
          )
        case 'dateAsk':
          return <DateAskScreen />
        default:
          return null
      }
    },
    [fridaySelectedIds, saturdaySelectedIds],
  )

  if (confirmedDetails) {
    return (
      <Celebration
        recipientName={recipient.name}
        fridayPicks={confirmedDetails.fridayPicks}
        saturdayPicks={confirmedDetails.saturdayPicks}
        onRestart={handleRestart}
      />
    )
  }

  const isDateAsk = step === 'dateAsk'
  const isWelcome = step === 'welcome'
  const selectionNextDisabled =
    (step === 'friday' && fridaySelectedIds.size === 0) ||
    (step === 'saturday' && saturdaySelectedIds.size === 0)

  return (
    <JourneyShell
      stepKey={step}
      renderStep={renderStep}
      onBack={goBack}
      onNext={isDateAsk ? handleYes : goNext}
      nextLabel={isDateAsk ? dateAsk.yesLabel : 'Next'}
      showBack={stepIndex > 0}
      backDisabled={stepIndex <= 0}
      nextDisabled={selectionNextDisabled}
      centerNext={isWelcome}
    />
  )
}
