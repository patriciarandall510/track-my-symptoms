# Deployment Guide

Your app is ready to deploy! Here are the recommended options:

## Option 1: Vercel (Recommended - Easiest for Next.js)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from the `web` directory**:
   ```bash
   cd web
   vercel
   ```

3. **Add environment variables**:
   - Go to your project on [vercel.com](https://vercel.com)
   - Navigate to Settings → Environment Variables
   - Add all variables from `.env.example` (without the `NEXT_PUBLIC_` prefix is already correct)

4. **Redeploy** after adding environment variables:
   ```bash
   vercel --prod
   ```

## Option 2: Firebase Hosting

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting** (from the `web` directory):
   ```bash
   cd web
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to: `.next`
   - Configure as single-page app: **No**
   - Set up automatic builds: **Yes**
   - Set build output directory to: `.next`

4. **Update `firebase.json`** (if needed):
   ```json
   {
     "hosting": {
       "public": ".next",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

5. **Build and deploy**:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## Option 3: Other Platforms

- **Netlify**: Connect your Git repo and set build command to `npm run build` and publish directory to `.next`
- **Railway**: Connect repo, set build command to `npm run build` and start command to `npm start`

## Important: Environment Variables

Make sure to set these environment variables in your hosting platform:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Post-Deployment Checklist

- [ ] Verify Firebase environment variables are set
- [ ] Test anonymous authentication works
- [ ] Test creating a pain log entry
- [ ] Test creating an activity event
- [ ] Verify Firestore security rules are deployed
- [ ] Test the chart displays correctly
- [ ] Test on mobile device

## Firestore Security Rules

Don't forget to deploy your Firestore security rules! The rules file is at `web/firestore.rules`. Deploy it via:

```bash
firebase deploy --only firestore:rules
```

