import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { profileAPI } from '../utils/api';
import toast from 'react-hot-toast';

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
    
    if (!userData?.profiles) return null;
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
            autoIncrementNumber: true
          },
          isDefault: true,
          createdAt: new Date().toISOString()
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
      toast.error(error.message);
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
        const profile = userData?.profiles?.find(p => p.id === profileId);
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
      const newProfile = {
        id: `profile_${Date.now()}`,
        displayName: profileData.displayName || 'New Profile',
        company: profileData.company || '',
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
        createdAt: new Date().toISOString()
      };
      
      const updatedProfiles = [...(userData?.profiles || []), newProfile];
      
      // Update user document with new profile
      const response = await profileAPI.update({ 
        profiles: updatedProfiles,
        activeProfileId: newProfile.id 
      });
      
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
      setUserData(response.data);
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
              createdAt: new Date().toISOString()
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
    if (userData?.profiles) {
      setProfiles(userData.profiles);
      if (userData.activeProfileId) {
        setActiveProfileId(userData.activeProfileId);
      }
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
    logout,
    updateUserProfile,
    changePassword,
    resetPassword,
    switchProfile,
    addProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
