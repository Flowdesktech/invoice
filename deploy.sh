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

# Step 1: Build client bundle
echo -e "${YELLOW}Step 1: Building client bundle...${NC}"
echo "----------------------------------------"
npm run build:client

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Client build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Client build completed successfully!${NC}"
echo ""

# Step 2: Build SSR bundle
echo -e "${YELLOW}Step 2: Building SSR bundle...${NC}"
echo "----------------------------------------"
npm run build:ssr

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: SSR build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ SSR build completed successfully!${NC}"
echo ""

# Step 3: Copy SSR template
echo -e "${YELLOW}Step 3: Copying SSR template...${NC}"
echo "----------------------------------------"
npm run build:copy-template

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Template copy failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ SSR template copied successfully!${NC}"
echo ""

# Step 4: Install functions dependencies
echo -e "${YELLOW}Step 4: Installing functions dependencies...${NC}"
echo "----------------------------------------"
cd functions && npm install && cd ..

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Functions dependency install failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Functions dependencies installed!${NC}"
echo ""

# Step 5: Deploy to Firebase
echo -e "${YELLOW}Step 5: Deploying to Firebase...${NC}"
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
echo -e "${BLUE}  - Public pages are server-side rendered (SSR)${NC}"
echo -e "${BLUE}  - Dashboard pages are client-side rendered (SPA)${NC}"
echo ""

# Optional: Open the hosting URL in browser
echo -e "${YELLOW}Opening your app in the browser...${NC}"
firebase open hosting:site
