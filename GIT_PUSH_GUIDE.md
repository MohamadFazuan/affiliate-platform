# Git Setup and GitHub Push Guide

## 🚀 Step-by-Step Instructions

### Step 1: Configure Git (if not already done)

Open a NEW terminal (cmd or Git Bash) and run:

```bash
git config user.name "MohamadFazuan"
git config user.email "your-email@example.com"  # Replace with your actual email
```

### Step 2: Add Files to Git

```bash
# Navigate to project directory
cd c:/Users/fazuan.wafat/Desktop/affiliate-platform

# Add all files (excluding those in .gitignore)
git add .

# Check what files will be committed
git status
```

### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: AffiliateIQ Platform - AI-powered video script generator"
```

### Step 4: Create GitHub Repository

1. Go to: https://github.com/MohamadFazuan
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `affiliate-platform` (or your preferred name)
   - **Description**: `AI-powered video script generator for affiliate marketers with RM credit system`
   - **Visibility**: Public or Private (your choice)
   - **DO NOT** check "Initialize this repository with a README"
4. Click **"Create repository"**

### Step 5: Connect to GitHub and Push

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add your GitHub repository as remote origin
git remote add origin https://github.com/MohamadFazuan/affiliate-platform.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Alternative: If Repository Already Exists

If you want to push to an existing repository:

```bash
# Add remote
git remote add origin https://github.com/MohamadFazuan/your-repo-name.git

# Force push (if needed)
git push -u origin main --force
```

---

## 🔐 Authentication Options

### Option 1: HTTPS with Personal Access Token (Recommended)

When prompted for password, use a **Personal Access Token** instead:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `affiliate-platform-token`
4. Select scopes:
   - ✅ `repo` (all)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

### Option 2: SSH (Advanced)

If you've set up SSH keys:

```bash
git remote set-url origin git@github.com:MohamadFazuan/affiliate-platform.git
git push -u origin main
```

---

## 📋 Quick Reference Commands

```bash
# Check Git status
git status

# View commit history
git log --oneline

# Check remote repository
git remote -v

# Pull latest changes
git pull origin main

# Push changes
git push origin main

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main
```

---

## 🐛 Troubleshooting

### Error: "fatal: not a git repository"

```bash
git init
```

### Error: "nul" file issue

The `.gitignore` has been updated to exclude Windows reserved names. Remove the file if it exists:

```bash
# Check if nul exists
ls -la | grep nul

# If it exists, the .gitignore will now exclude it
```

### Error: "Updates were rejected"

```bash
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push origin main
```

### Error: Authentication failed

- Make sure you're using a Personal Access Token, not your password
- Token must have `repo` permissions
- Update credentials in Git Credential Manager

---

## 📂 What's Being Pushed

The following will be committed:

- ✅ Source code (`src/`, `backend/`)
- ✅ Database schemas and seeds (`database/`)
- ✅ Configuration files (`package.json`, `tsconfig.json`, etc.)
- ✅ Documentation (`docs/`, `README.md`, `MVP_TASKS.md`)
- ❌ `node_modules/` (excluded by .gitignore)
- ❌ `.env` files (excluded by .gitignore)
- ❌ `.next/`, `.wrangler/` (excluded by .gitignore)

---

## 🎯 After Pushing Successfully

Your repository will be available at:
```
https://github.com/MohamadFazuan/affiliate-platform
```

### Enable GitHub Pages (Optional)

If you want to showcase documentation:

1. Go to repository **Settings** → **Pages**
2. Source: Deploy from branch
3. Branch: `main` → `/docs`
4. Click **Save**

---

## 📧 Need Help?

If you encounter issues:

1. Check Git version: `git --version`
2. Verify remote: `git remote -v`
3. Check SSH/HTTPS: Make sure URL format is correct
4. GitHub authentication: Use Personal Access Token

---

**Created:** February 14, 2026  
**Repository Owner:** MohamadFazuan  
**Project:** AffiliateIQ Platform
