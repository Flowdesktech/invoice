# GitHub Secrets Setup Guide

This guide will help you set up the required GitHub secrets for CI/CD pipeline.

## Required Secrets

### Firebase Configuration Secrets

These secrets are required for building the application with proper Firebase configuration:

1. **VITE_FIREBASE_API_KEY**
   - Your Firebase API Key
   - Found in Firebase Console > Project Settings > General

2. **VITE_FIREBASE_AUTH_DOMAIN**
   - Your Firebase Auth Domain
   - Format: `your-project-id.firebaseapp.com`

3. **VITE_FIREBASE_PROJECT_ID**
   - Your Firebase Project ID
   - Found in Firebase Console > Project Settings > General

4. **VITE_FIREBASE_STORAGE_BUCKET**
   - Your Firebase Storage Bucket
   - Format: `your-project-id.appspot.com`

5. **VITE_FIREBASE_MESSAGING_SENDER_ID**
   - Your Firebase Messaging Sender ID
   - Found in Firebase Console > Project Settings > Cloud Messaging

6. **VITE_FIREBASE_APP_ID**
   - Your Firebase App ID
   - Found in Firebase Console > Project Settings > General

### Firebase Deployment Secrets

These secrets are required for deploying to Firebase:

1. **FIREBASE_SERVICE_ACCOUNT** (Required)
   - A JSON key for Firebase service account
   - To create:
     1. Go to Firebase Console > Project Settings > Service Accounts
     2. Click "Generate new private key"
     3. Download the JSON file
     4. Copy the entire JSON content as the secret value
   - **Important**: This is the ONLY authentication method needed for deployment
   - The deploy.yml uses this for all Firebase deployments (Hosting, Functions, Rules)
   
   **Required IAM Permissions:**
   The service account must have these roles in Google Cloud Console:
   - `Firebase Admin` (roles/firebase.admin)
   - `Service Account User` (roles/iam.serviceAccountUser)
   - `Cloud Functions Developer` (roles/cloudfunctions.developer)
   - `Firebase Extensions Admin` (roles/firebaseextensions.admin)
   
   **Option A: Add Permissions to Existing Service Account**
   1. Go to [Google Cloud Console](https://console.cloud.google.com)
   2. Navigate to "IAM & Admin" > "IAM"
   3. Find your service account and click "Edit"
   4. Add ALL the required roles listed above
   
   **Option B: Use Firebase Admin SDK Default Account (Easier)**
   1. Go to Firebase Console > Project Settings > Service Accounts
   2. Click "Generate new private key" for "Firebase Admin SDK"
   3. This account usually has all permissions by default
   
   **Option C: Create New Service Account via gcloud CLI**
   ```bash
   # Create service account
   gcloud iam service-accounts create github-actions-deploy \
     --display-name="GitHub Actions Deploy" \
     --project=YOUR-PROJECT-ID
   
   # Grant all required roles
   gcloud projects add-iam-policy-binding YOUR-PROJECT-ID \
     --member="serviceAccount:github-actions-deploy@YOUR-PROJECT-ID.iam.gserviceaccount.com" \
     --role="roles/firebase.admin"
   
   gcloud projects add-iam-policy-binding YOUR-PROJECT-ID \
     --member="serviceAccount:github-actions-deploy@YOUR-PROJECT-ID.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"
   
   gcloud projects add-iam-policy-binding YOUR-PROJECT-ID \
     --member="serviceAccount:github-actions-deploy@YOUR-PROJECT-ID.iam.gserviceaccount.com" \
     --role="roles/cloudfunctions.developer"
   
   gcloud projects add-iam-policy-binding YOUR-PROJECT-ID \
     --member="serviceAccount:github-actions-deploy@YOUR-PROJECT-ID.iam.gserviceaccount.com" \
     --role="roles/firebaseextensions.admin"
   
   # Generate key
   gcloud iam service-accounts keys create key.json \
     --iam-account=github-actions-deploy@YOUR-PROJECT-ID.iam.gserviceaccount.com
   ```

### Firebase Functions Environment Variables

These secrets are used by Firebase Functions (optional, but recommended for full functionality):

1. **MAILGUN_API_KEY**
   - Mailgun API key for sending emails
   - Get from: https://app.mailgun.com/app/account/security/api_keys

2. **MAILGUN_DOMAIN**
   - Your verified Mailgun domain (e.g., `mg.yourdomain.com`)

3. **MAILGUN_FROM_EMAIL**
   - Email address for sending invoices (e.g., `noreply@yourdomain.com`)

4. **STRIPE_SECRET_KEY**
   - Stripe secret key for payment processing
   - Get from: https://dashboard.stripe.com/apikeys

5. **STRIPE_WEBHOOK_SECRET**
   - Stripe webhook endpoint secret
   - Get from: https://dashboard.stripe.com/webhooks

6. **OPENAI_API_KEY**
   - OpenAI API key for AI features (if applicable)
   - Get from: https://platform.openai.com/api-keys

## How to Add Secrets to GitHub

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click on "Secrets and variables" > "Actions"
4. Click "New repository secret"
5. Add each secret with the name and value from above

## Example .env File Structure

Create a `.env` file in your project root (for local development):

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# DO NOT commit this file to version control
```

## Verification

After setting up all secrets:

1. Push a commit to a feature branch to trigger the CI tests
2. Create a PR to see the tests run
3. Merge to main/master to trigger deployment

## Security Notes

- Never commit sensitive information to the repository
- Keep your service account key secure
- Rotate tokens periodically
- Use least-privilege principles for service accounts
