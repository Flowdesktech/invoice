#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Invoice Management Deployment Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed!${NC}"
    exit 1
fi

# Check if firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}Error: Firebase CLI is not installed!${NC}"
    echo -e "${YELLOW}Install it with: npm install -g firebase-tools${NC}"
    exit 1
fi

# Step 1: Build the frontend
echo -e "${YELLOW}Step 1: Building frontend...${NC}"
echo "----------------------------------------"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Frontend build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Frontend build completed successfully!${NC}"
echo ""

# Step 2: Deploy to Firebase
echo -e "${YELLOW}Step 2: Deploying to Firebase...${NC}"
echo "----------------------------------------"
firebase deploy

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Firebase deployment failed!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Your app is now live at your Firebase hosting URL.${NC}"
echo ""

# Optional: Open the hosting URL in browser
echo -e "${YELLOW}Opening your app in the browser...${NC}"
firebase open hosting:site
