import React, { createContext, useContext } from 'react';

/**
 * Server-side stub for AuthContext.
 *
 * During the SSR Vite build, this file replaces ./contexts/AuthContext via a
 * resolve alias so that every component calling useAuth() gets safe default
 * values without pulling in the Firebase client SDK.
 */

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const noopValue = {
  currentUser: null,
  userData: null,
  loading: false,
  profiles: [],
  activeProfileId: null,
  currentProfile: null,
  signup: async () => {},
  login: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
  changePassword: async () => {},
  resetPassword: async () => {},
  switchProfile: async () => {},
  addProfile: async () => {},
  refreshUserProfile: () => {},
};

export const AuthProvider = ({ children }) => {
  return <AuthContext.Provider value={noopValue}>{children}</AuthContext.Provider>;
};
