import { useState } from 'react'
import { Hero } from './components/Hero'
import { DateModal } from './components/DateModal'
import { Celebration } from './components/Celebration'
import {
  recipient,
  venues,
  defaultDateTime,
  getDefaultVenue,
} from './config/content'

const FLOW = {
  HERO: 'hero',
  MODAL: 'modal',
  CONFIRMED: 'confirmed',
}

export default function App() {
  const [flow, setFlow] = useState(FLOW.HERO)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmedDetails, setConfirmedDetails] = useState(null)

  const defaultVenue = getDefaultVenue()

  const handleYes = () => {
    setModalOpen(true)
    setFlow(FLOW.MODAL)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setFlow(FLOW.HERO)
  }

  const handleConfirm = ({ venue, dateTimeIso }) => {
    setModalOpen(false)
    setConfirmedDetails({ venue, dateTimeIso })
    setFlow(FLOW.CONFIRMED)
  }

  const handleRestart = () => {
    setConfirmedDetails(null)
    setFlow(FLOW.HERO)
  }

  if (flow === FLOW.CONFIRMED && confirmedDetails) {
    return (
      <Celebration
        recipientName={recipient.name}
        venue={confirmedDetails.venue}
        dateTimeIso={confirmedDetails.dateTimeIso}
        onRestart={handleRestart}
      />
    )
  }

  return (
    <>
      <Hero onYes={handleYes} />
      <DateModal
        open={modalOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirm}
        venues={venues}
        defaultVenueId={defaultVenue.id}
        defaultDateTime={defaultDateTime}
      />
    </>
  )
}
