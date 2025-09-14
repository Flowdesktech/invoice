# Firebase Service Account Setup for PDF Generation

## Issue
The PDF generation feature requires Firebase service account credentials to create signed URLs for PDF storage. Without these credentials, you'll see the error:
```
Failed to generate PDF: Cannot sign data without `client_email`
```

## Solution

### Step 1: Download Service Account Key
1. Go to the [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click the gear icon ⚙️ and select **Project settings**
4. Navigate to the **Service accounts** tab
5. Click **Generate new private key**
6. Confirm by clicking **Generate key**
7. Save the downloaded JSON file

### Step 2: Add Service Account to Project
1. Rename the downloaded file to `serviceAccountKey.json`
2. Place it in the `functions` directory:
   ```
   D:\InvoiceManagement\
   └── functions\
       └── serviceAccountKey.json  <-- Place here
   ```

### Step 3: Update .gitignore (Important!)
Add this line to your `.gitignore` file to prevent exposing credentials:
```
functions/serviceAccountKey.json
```

### Step 4: Set Environment Variable (Optional)
If your storage bucket name differs from the default, add to your `.env` file:
```
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

### Step 5: Restart Functions
After adding the service account:
```bash
# Stop the current emulator (Ctrl+C)
# Start it again
npm run serve
```

## Alternative Solutions

### For Local Development Only
If you only need PDF generation in development and don't want to use service accounts:

1. Modify `functions/services/pdfService.js` to return public URLs instead of signed URLs
2. Note: This will make PDFs publicly accessible without authentication

### For Production
In production Firebase Functions, the credentials are automatically available, so this issue typically only affects local development.

## Security Notes
- **NEVER** commit the `serviceAccountKey.json` file to version control
- Keep this file secure as it provides admin access to your Firebase project
- For production, use environment-specific service accounts with limited permissions

## Verification
After setup, test PDF generation:
1. Go to the invoice list
2. Click the download button on any invoice without a PDF
3. The PDF should generate and open successfully
