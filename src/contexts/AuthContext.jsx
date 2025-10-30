import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { profileAPI } from '../utils/api';
import toast from 'react-hot-toast';
import LoadingScreen from '../components/LoadingScreen';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);

  // Load active profile from localStorage
  useEffect(() => {
    const savedProfileId = localStorage.getItem('flowdesk_active_profile');
    if (savedProfileId && savedProfileId !== 'null') {
      setActiveProfileId(savedProfileId);
    } else if (!savedProfileId || savedProfileId === 'null') {
      setActiveProfileId(null);
    }
  }, []);

  // Save active profile to localStorage
  useEffect(() => {
    if (activeProfileId === null) {
      localStorage.removeItem('flowdesk_active_profile');
    } else {
      localStorage.setItem('flowdesk_active_profile', activeProfileId);
    }
  }, [activeProfileId]);

  // Get current profile
  const getCurrentProfile = () => {
    // If activeProfileId is null, user is using personal account
    if (activeProfileId === null) return null;
    
    // Ensure profiles is an array before using find
    if (!userData?.profiles || !Array.isArray(userData.profiles)) return null;
    return userData.profiles.find(p => p.id === activeProfileId) || userData.profiles[0];
  };

  // Sign up function
  const signup = async (email, password, displayName, companyData) => {
    try {
      // Create user account
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(user, { displayName });
      
      // Create user profile with default business profile
      const userDoc = {
        uid: user.uid,
        email: user.email,
        activeProfileId: 'default',
        profiles: [{
          id: 'default',
          name: 'Main Business',
          displayName,
          company: companyData.company || '',
          phone: companyData.phone || '',
          address: companyData.address || {},
          invoiceSettings: {
            prefix: 'INV',
            nextNumber: 1,
            taxRate: 0,
            currency: 'USD',
            paymentTerms: 'Due on receipt',
            dueDateDuration: 7,
            autoIncrementNumber: true,
            timezone: companyData.timezone || 'America/New_York'
          },
          isDefault: true,
          createdAt: new Date().valueOf()
        }]
      };
      
      // Wait for auth state to update before making API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await profileAPI.update(userDoc);
      setUserData(response.data);
      
      toast.success('Account created successfully!');
      return user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Sign in function
  const login = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
      return user;
    } catch (error) {
      console.log('Auth error:', error.code, error.message);
      
      // Firebase v9+ specific error handling
      // When a user tries to sign in with password but the account uses a different provider
      if (error.code === 'auth/invalid-credential' || 
          error.code === 'auth/invalid-login-credentials' ||
          error.code === 'auth/wrong-password') {
        
        // Since fetchSignInMethodsForEmail is deprecated, we'll provide helpful guidance
        // based on the error pattern
        toast.error(
          'Invalid email or password. If you previously signed in with Google, ' +
          'please use "Sign in with Google" instead.',
          { duration: 5000 }
        );
        
        // Still throw the special error to trigger UI effects
        throw new Error('EMAIL_LINKED_TO_GOOGLE');
      }
      
      // Show user-friendly error messages for other cases
      const errorMessages = {
        'auth/user-not-found': 'No account found with this email address.',
        'auth/invalid-email': 'Invalid email address format.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
      };
      
      const friendlyMessage = errorMessages[error.code] || 'Authentication failed. Please try again.';
      toast.error(friendlyMessage);
      throw error;
    }
  };

  // Google Sign-In function
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      
      // Check if this is a new user (first time Google sign-in)
      const response = await profileAPI.get();
      if (!response.data || !response.data.profiles) {
        // Create default profile for new Google users
        const userDoc = {
          uid: user.uid,
          email: user.email,
          activeProfileId: 'default',
          profiles: [{
            id: 'default',
            name: 'Main Business',
            displayName: user.displayName || '',
            company: '',
            phone: '',
            address: {},
            invoiceSettings: {
              prefix: 'INV',
              nextNumber: 1,
              taxRate: 0,
              currency: 'USD',
              paymentTerms: 'Due on receipt',
              dueDateDuration: 7,
              autoIncrementNumber: true,
              timezone: 'America/New_York'
            },
            isDefault: true,
            createdAt: new Date().valueOf()
          }]
        };
        
        await profileAPI.update(userDoc);
      }
      
      toast.success('Signed in with Google successfully!');
      return user;
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup without signing in
        toast.error('Sign-in cancelled');
      } else {
        toast.error(error.message);
      }
      throw error;
    }
  };

  // Sign out function
  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      setProfiles([]);
      setActiveProfileId('default');
      localStorage.removeItem('flowdesk_active_profile');
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (currentUser && userData) {
        let updateData = {};
        
        if (activeProfileId === null) {
          // Personal account - update userData directly
          updateData = {
            ...updates,
            // Merge nested objects like address and invoiceSettings
            address: updates.address ? { ...userData.address, ...updates.address } : userData.address,
            invoiceSettings: updates.invoiceSettings ? { ...userData.invoiceSettings, ...updates.invoiceSettings } : userData.invoiceSettings
          };
        } else {
          // Business profile - update the specific profile in the profiles array
          // Ensure profiles is an array
          if (!userData?.profiles || !Array.isArray(userData.profiles)) {
            throw new Error('No profiles found');
          }
          const updatedProfiles = userData.profiles.map(profile => {
            if (profile.id === activeProfileId) {
              return {
                ...profile,
                ...updates,
                // Merge nested objects like address and invoiceSettings
                address: updates.address ? { ...profile.address, ...updates.address } : profile.address,
                invoiceSettings: updates.invoiceSettings ? { ...profile.invoiceSettings, ...updates.invoiceSettings } : profile.invoiceSettings
              };
            }
            return profile;
          });
          
          updateData = { profiles: updatedProfiles };
        }
        
        // Update the user document
        const response = await profileAPI.update(updateData);
        
        // Update local userData
        setUserData(response.data);
        
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Change password
  const changePassword = async (newPassword) => {
    try {
      if (currentUser) {
        await updatePassword(currentUser, newPassword);
        toast.success('Password updated successfully!');
      }
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Switch between profiles
  const switchProfile = async (profileId) => {
    try {
      if (profileId === 'personal') {
        // Switching to personal account (no profileId)
        setActiveProfileId(null);
        localStorage.removeItem('flowdesk_active_profile');
        
        // Update user's active profile in database
        await profileAPI.update({ activeProfileId: null });
        
        toast.success('Switched to Personal Account');
      } else {
        // Switching to a business profile
        // Ensure profiles is an array before using find
        if (!userData?.profiles || !Array.isArray(userData.profiles)) {
          throw new Error('No profiles found');
        }
        const profile = userData.profiles.find(p => p.id === profileId);
        if (!profile) {
          throw new Error('Profile not found');
        }
        
        setActiveProfileId(profileId);
        
        // Update user's active profile in database
        await profileAPI.update({ activeProfileId: profileId });
        
        toast.success(`Switched to ${profile.displayName || profile.company}`);
      }
      
      // Reload the page to refresh all data for the new profile
      window.location.reload();
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Add new profile
  const addProfile = async (profileData) => {
    try {
      // console.log('AuthContext - addProfile received data:', profileData);
      const newProfile = {
        id: `profile_${Date.now()}`,
        displayName: profileData.displayName || 'New Profile',
        company: profileData.company || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        address: profileData.address || {},
        invoiceSettings: {
          prefix: 'INV',
          nextNumber: 1,
          taxRate: 0,
          currency: 'USD',
          paymentTerms: 'Due on receipt',
          dueDateDuration: 7,
          autoIncrementNumber: true
        },
        createdAt: new Date().valueOf()
      };
      
      // Ensure profiles is an array
      const currentProfiles = Array.isArray(userData?.profiles) ? userData.profiles : [];
      const updatedProfiles = [...currentProfiles, newProfile];
      
      // Update user document with new profile
      const updateData = { 
        profiles: updatedProfiles,
        activeProfileId: newProfile.id 
      };
      
      // console.log('AuthContext - Data being sent to API:', JSON.stringify(updateData, null, 2));
      const response = await profileAPI.update(updateData);
      
      setUserData(response.data);
      setActiveProfileId(newProfile.id);
      
      toast.success('New profile created successfully!');
      
      // Reload to refresh all data
      window.location.reload();
      
      return newProfile;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Fetch user data from API
  const fetchUserData = async (user) => {
    try {
      const response = await profileAPI.get();
      // Ensure profiles is an array if it exists
      const data = response.data;
      if (data && !Array.isArray(data.profiles)) {
        // If profiles is not an array or doesn't exist, create a default profile array
        data.profiles = [{
          id: 'default',
          name: 'Main Business',
          displayName: data.displayName || user.displayName || '',
          company: data.company || '',
          phone: data.phone || '',
          address: data.address || {},
          invoiceSettings: data.invoiceSettings || {
            prefix: 'INV',
            nextNumber: 1,
            taxRate: 0,
            currency: 'USD',
            paymentTerms: 'Due on receipt',
            dueDateDuration: 7,
            autoIncrementNumber: true
          },
          isDefault: true,
          createdAt: new Date().valueOf()
        }];
        data.activeProfileId = 'default';
      }
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If profile doesn't exist, create one with default profile
      if (error.response?.status === 404) {
        try {
          const newUserDoc = {
            uid: user.uid,
            email: user.email,
            activeProfileId: 'default',
            profiles: [{
              id: 'default',
              name: 'Main Business',
              displayName: user.displayName || '',
              company: '',
              phone: '',
              address: {},
              invoiceSettings: {
                prefix: 'INV',
                nextNumber: 1,
                taxRate: 0,
                currency: 'USD',
                paymentTerms: 'Due on receipt',
                dueDateDuration: 7,
                autoIncrementNumber: true
              },
              isDefault: true,
              createdAt: new Date().valueOf()
            }]
          };
          const response = await profileAPI.update(newUserDoc);
          setUserData(response.data);
        } catch (createError) {
          console.error('Error creating user profile:', createError);
        }
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user);
      } else {
        setUserData(null);
        setProfiles([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Update profiles when userData changes
  useEffect(() => {
    if (userData?.profiles && Array.isArray(userData.profiles)) {
      setProfiles(userData.profiles);
      if (userData.activeProfileId) {
        setActiveProfileId(userData.activeProfileId);
      }
    } else if (userData) {
      // If userData exists but profiles is not an array, set empty array
      setProfiles([]);
    }
  }, [userData]);

  const value = {
    currentUser,
    userData,
    loading,
    profiles,
    activeProfileId,
    currentProfile: getCurrentProfile(),
    signup,
    login,
    signInWithGoogle,
    logout,
    updateUserProfile,
    changePassword,
    resetPassword,
    switchProfile,
    addProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};
