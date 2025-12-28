# How to Deploy to GitHub

Your app is ready to share! Because all personal data is stored in your browser (Local Storage), the code itself is safe to upload.

## Prerequisite
1.  **Create a GitHub Account** if you don't have one.
2.  **Create a New Repository**:
    - Go to [GitHub.com/new](https://github.com/new).
    - Repository name: `budget-tracker` (or whatever you like).
    - **Public** or **Private** (doesn't matter for safety, but Private is good for peace of mind).
    - Do **not** check "Initialize with README" (we already have code).

## Step 1: Push your code
Open your terminal (where you are running the app) and stop the server (Ctrl+C) if needed, then run these commands:

```bash
# Link your local code to the new GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Upload the code
git branch -M main
git push -u origin main
```

*(Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with the actual URL from GitHub)*

## Step 2: Deploy to the Web (Optional)
If you want to access the app from anywhere (without running `npm run dev`), you can use GitHub Pages:

1.  Go to your Repository **Settings** > **Pages**.
2.  Under **Source**, select `GitHub Actions` or just use the `main` branch if you want a simple setup, but for React apps, the best way is usually automated. 

**Easiest Way (Netlify/Vercel)**:
1.  Go to [Vercel.com](https://vercel.com) or [Netlify.com](https://netlify.com).
2.  "Add New Project" -> "Import from GitHub".
3.  Select your `budget-tracker` repo.
4.  Click **Deploy**.
5.  Done! You get a URL like `https://budget-tracker-xyz.vercel.app` that works on your iPhone anywhere.

## Safety Note
- **Your Data**: Stored only on the device you use.
- **Syncing**: If you switch from iPhone to Mac, your data won't transfer automatically unless we add cloud database features later.
