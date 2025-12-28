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
Open your terminal (stop the server with Ctrl+C first) and run:

```bash
# Link your local code to the new GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Upload your code
git branch -M main
git push -u origin main
```

## Step 2: Deploy to the Web (Automated)
I have created a special script to handle the website deployment for you.

1.  Run this command in your terminal:
    ```bash
    npm run deploy
    ```
    *(This builds your app and uploads it to a hidden 'gh-pages' branch)*

2.  Go to your GitHub Repository **Settings** > **Pages** (the screen in your screenshot).
3.  Under **Source**, select **"Deploy from a branch"**.
4.  Under **Branch**, select `gh-pages` (it should appear after you run the command above) and `/ (root)`.
5.  Click **Save**.

## Safety Note
- **Your Data**: Stored only on the device you use (Local Storage).
- **No Sync**: Data on your iPhone is separate from your Computer.

