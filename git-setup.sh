#!/bin/bash

# Git setup and push script

echo "Setting up Git configuration..."
git config user.name "MohamadFazuan"
git config user.email "your-email@example.com"

echo "Adding files to Git..."
git add .gitignore
git add README.md MVP_TASKS.md
git add package.json package-lock.json tsconfig.json next.config.js
git add tailwind.config.js postcss.config.js components.json
git add wrangler.toml
git add -f backend/
git add -f database/
git add -f src/
git add -f public/
git add -f docs/

echo "Creating initial commit..."
git commit -m "Initial commit: AffiliateIQ Platform - AI-powered video script generator with RM credit system"

echo "Creating repository name..."
REPO_NAME="affiliate-platform"

echo ""
echo "=========================================="
echo "Next steps:"
echo "=========================================="
echo "1. Create a new repository on GitHub:"
echo "   Go to: https://github.com/MohamadFazuan?tab=repositories"
echo "   Click: 'New' button"
echo "   Name: ${REPO_NAME}"
echo "   Description: AI-powered video script generator for affiliate marketers"
echo "   Keep it Public or Private (your choice)"
echo "   Do NOT initialize with README (we already have one)"
echo ""
echo "2. After creating the repository, run these commands:"
echo ""
echo "   git remote add origin https://github.com/MohamadFazuan/${REPO_NAME}.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "=========================================="
