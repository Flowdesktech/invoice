const { db } = require('../config/firebase');

class MigrationService {
  constructor() {
    this.usersCollection = db.collection('users');
  }

  /**
   * Migrate user data to ensure profiles is always an array
   */
  async migrateUserProfiles() {
    console.log('Starting user profiles migration...');
    
    try {
      const usersSnapshot = await this.usersCollection.get();
      let migratedCount = 0;
      let skippedCount = 0;
      
      for (const doc of usersSnapshot.docs) {
        const userData = doc.data();
        
        // Skip if profiles already exists and is an array
        if (userData.profiles && Array.isArray(userData.profiles)) {
          skippedCount++;
          continue;
        }
        
        // Create default profile from existing user data
        const defaultProfile = {
          id: 'default',
          name: 'Main Business',
          displayName: userData.displayName || '',
          company: userData.company || '',
          phone: userData.phone || '',
          address: userData.address || {},
          invoiceSettings: userData.invoiceSettings || {
            prefix: 'INV',
            nextNumber: 1,
            taxRate: 0,
            currency: 'USD',
            paymentTerms: 'Due on receipt',
            dueDateDuration: 7,
            autoIncrementNumber: true
          },
          isDefault: true,
          createdAt: userData.createdAt || Date.now()
        };
        
        // Update user document with profiles array
        await this.usersCollection.doc(doc.id).update({
          profiles: [defaultProfile],
          activeProfileId: userData.activeProfileId || 'default',
          updatedAt: Date.now()
        });
        
        migratedCount++;
        console.log(`Migrated user: ${doc.id}`);
      }
      
      console.log(`Migration complete. Migrated: ${migratedCount}, Skipped: ${skippedCount}`);
      return { migratedCount, skippedCount };
      
    } catch (error) {
      console.error('Error during migration:', error);
      throw error;
    }
  }

  /**
   * Check if a user needs migration
   */
  async checkUserNeedsMigration(userId) {
    const doc = await this.usersCollection.doc(userId).get();
    if (!doc.exists) return false;
    
    const userData = doc.data();
    return !userData.profiles || !Array.isArray(userData.profiles);
  }

  /**
   * Migrate a single user
   */
  async migrateSingleUser(userId) {
    const doc = await this.usersCollection.doc(userId).get();
    if (!doc.exists) {
      throw new Error('User not found');
    }
    
    const userData = doc.data();
    
    // Skip if already migrated
    if (userData.profiles && Array.isArray(userData.profiles)) {
      return userData;
    }
    
    // Create default profile from existing user data
    const defaultProfile = {
      id: 'default',
      name: 'Main Business',
      displayName: userData.displayName || '',
      company: userData.company || '',
      phone: userData.phone || '',
      address: userData.address || {},
      invoiceSettings: userData.invoiceSettings || {
        prefix: 'INV',
        nextNumber: 1,
        taxRate: 0,
        currency: 'USD',
        paymentTerms: 'Due on receipt',
        dueDateDuration: 7,
        autoIncrementNumber: true
      },
      isDefault: true,
      createdAt: userData.createdAt || Date.now()
    };
    
    // Update user document
    await this.usersCollection.doc(userId).update({
      profiles: [defaultProfile],
      activeProfileId: userData.activeProfileId || 'default',
      updatedAt: Date.now()
    });
    
    // Return updated user data
    const updatedDoc = await this.usersCollection.doc(userId).get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  }
}

module.exports = new MigrationService();
