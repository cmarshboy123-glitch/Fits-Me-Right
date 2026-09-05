import { createContext, useContext, useMemo, useState } from 'react'

const StyleContext = createContext(null)

const initialSelections = {
  gender: '',
  bodyType: '',
  shirtSize: '',
  pantsSize: '',
  priceTier: '',
  dressCode: '',
}

export function StyleProvider({ children }) {
  const [selections, setSelections] = useState(initialSelections)
  const [profiles, setProfiles] = useState([])

  const updateSelection = (key, value) => {
    setSelections((current) => ({ ...current, [key]: value }))
  }

  const resetSelections = () => setSelections(initialSelections)

  const saveProfile = (name) => {
    const profile = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      selections: { ...selections },
    }
    setProfiles((current) => [...current, profile])
    return profile
  }

  const loadProfile = (id) => {
    const profile = profiles.find((item) => item.id === id)
    if (profile) setSelections({ ...profile.selections })
  }

  const deleteProfile = (id) => setProfiles((current) => current.filter((profile) => profile.id !== id))

  const value = useMemo(
    () => ({ selections, profiles, updateSelection, resetSelections, saveProfile, loadProfile, deleteProfile }),
    [selections, profiles],
  )

  return <StyleContext.Provider value={value}>{children}</StyleContext.Provider>
}

export function useStyle() {
  const context = useContext(StyleContext)
  if (!context) throw new Error('useStyle must be used within StyleProvider')
  return context
}
