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

1. **FIREBASE_SERVICE_ACCOUNT**
   - A JSON key for Firebase service account
   - To create:
     1. Go to Firebase Console > Project Settings > Service Accounts
     2. Click "Generate new private key"
     3. Download the JSON file
     4. Copy the entire JSON content as the secret value

2. **FIREBASE_TOKEN**
   - Firebase CI token for deployment
   - To create:
     1. Install Firebase CLI: `npm install -g firebase-tools`
     2. Run: `firebase login:ci`
     3. Copy the token provided

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
