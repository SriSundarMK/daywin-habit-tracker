import { useState, useEffect } from 'react'

const KEY = 'daywin_profile_id'

function getOrCreateProfileId() {
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  return id
}

export function useAuth() {
  const [profileId, setProfileId] = useState(null)

  useEffect(() => {
    setProfileId(getOrCreateProfileId())
  }, [])

  const importProfile = (code) => {
    const clean = code.trim()
    if (!clean) return false
    localStorage.setItem(KEY, clean)
    setProfileId(clean)
    return true
  }

  return { profileId, importProfile }
}
