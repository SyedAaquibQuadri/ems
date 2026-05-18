import React, { createContext, useEffect, useState } from 'react'
import { getLocalStorage, setLocalStorage } from '../utils/localStorage'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {

  // ✅ Seed and read data immediately, not in useEffect
  setLocalStorage()
  const { employees } = getLocalStorage()

  const [userData, setUserData] = useState(employees)  // ✅ initialized with data

  return (
    <AuthContext.Provider value={[userData, setUserData]}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider