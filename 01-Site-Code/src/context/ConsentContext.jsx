import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getConsent, saveConsent } from '../utils/consent'

const ConsentContext = createContext(null)

export function ConsentProvider({ children }) {
  const [choice, setChoice] = useState(() => getConsent())
  const [settingsOpen, setSettingsOpen] = useState(false)

  const save = useCallback((categories) => {
    setChoice(saveConsent(categories))
    setSettingsOpen(false)
  }, [])

  const value = useMemo(() => ({
    choice,
    // The banner stays until the visitor has made a choice.
    needsChoice: !choice,
    settingsOpen,
    openSettings: () => setSettingsOpen(true),
    closeSettings: () => setSettingsOpen(false),
    acceptAll: () => save({ analytics: true, marketing: true }),
    rejectNonEssential: () => save({ analytics: false, marketing: false }),
    save,
  }), [choice, settingsOpen, save])

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}

export function useConsent() {
  const context = useContext(ConsentContext)
  if (!context) throw new Error('useConsent must be used within ConsentProvider')
  return context
}
