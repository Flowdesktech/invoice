#!/bin/bash

# Advanced deployment script with options
# Usage: ./deploy-advanced.sh [options]
# Options:
#   --functions-only  : Deploy only Firebase Functions
#   --hosting-only    : Deploy only Firebase Hosting
#   --skip-build      : Skip the frontend build step
#   --preview         : Deploy to preview channel instead of production

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default options
DEPLOY_FUNCTIONS=true
DEPLOY_HOSTING=true
SKIP_BUILD=false
PREVIEW_MODE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --functions-only)
            DEPLOY_HOSTING=false
            shift
            ;;
        --hosting-only)
            DEPLOY_FUNCTIONS=false
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --preview)
            PREVIEW_MODE=true
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Usage: $0 [--functions-only] [--hosting-only] [--skip-build] [--preview]"
            exit 1
            ;;
    esac
done

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Invoice Management Deployment Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Show deployment configuration
echo -e "${CYAN}Deployment Configuration:${NC}"
echo -e "  Deploy Functions: ${YELLOW}$DEPLOY_FUNCTIONS${NC}"
echo -e "  Deploy Hosting: ${YELLOW}$DEPLOY_HOSTING${NC}"
echo -e "  Skip Build: ${YELLOW}$SKIP_BUILD${NC}"
echo -e "  Preview Mode: ${YELLOW}$PREVIEW_MODE${NC}"
echo ""

# Check prerequisites
echo -e "${CYAN}Checking prerequisites...${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed!${NC}"
    exit 1
else
    echo -e "${GREEN}✓ npm found${NC}"
fi

if ! command -v firebase &> /dev/null; then
    echo -e "${RED}✗ Firebase CLI is not installed!${NC}"
    echo -e "${YELLOW}  Install it with: npm install -g firebase-tools${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Firebase CLI found${NC}"
fi

# Check if user is logged in to Firebase
firebase projects:list &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}You need to login to Firebase${NC}"
    firebase login
fi

echo ""

# Build frontend if hosting is being deployed and not skipped
if [ "$DEPLOY_HOSTING" = true ] && [ "$SKIP_BUILD" = false ]; then
    echo -e "${YELLOW}Step 1: Building frontend...${NC}"
    echo "----------------------------------------"
    
    # Clean previous build
    if [ -d "dist" ]; then
        echo "Cleaning previous build..."
        rm -rf dist
    fi
    
    npm run build
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Frontend build failed!${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Frontend build completed successfully!${NC}"
    echo ""
elif [ "$SKIP_BUILD" = true ]; then
    echo -e "${YELLOW}Skipping frontend build as requested${NC}"
    echo ""
fi

# Install functions dependencies if deploying functions
if [ "$DEPLOY_FUNCTIONS" = true ]; then
    echo -e "${YELLOW}Step 2: Installing Functions dependencies...${NC}"
    echo "----------------------------------------"
    cd functions
    npm install
    cd ..
    echo -e "${GREEN}✓ Functions dependencies installed${NC}"
    echo ""
fi

# Deploy to Firebase
echo -e "${YELLOW}Step 3: Deploying to Firebase...${NC}"
echo "----------------------------------------"

# Build deploy command
DEPLOY_CMD="firebase deploy"

if [ "$DEPLOY_FUNCTIONS" = true ] && [ "$DEPLOY_HOSTING" = false ]; then
    DEPLOY_CMD="$DEPLOY_CMD --only functions"
elif [ "$DEPLOY_HOSTING" = true ] && [ "$DEPLOY_FUNCTIONS" = false ]; then
    DEPLOY_CMD="$DEPLOY_CMD --only hosting"
fi

if [ "$PREVIEW_MODE" = true ] && [ "$DEPLOY_HOSTING" = true ]; then
    # Generate preview channel name with timestamp
    PREVIEW_CHANNEL="preview-$(date +%Y%m%d-%H%M%S)"
    echo -e "${CYAN}Creating preview channel: $PREVIEW_CHANNEL${NC}"
    DEPLOY_CMD="firebase hosting:channel:deploy $PREVIEW_CHANNEL --expires 7d"
fi

echo -e "${CYAN}Running: $DEPLOY_CMD${NC}"
eval $DEPLOY_CMD

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Firebase deployment failed!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Show deployment info
if [ "$PREVIEW_MODE" = true ]; then
    echo -e "${BLUE}Your preview deployment is available for 7 days${NC}"
else
    echo -e "${BLUE}Your app is now live in production!${NC}"
    
    # Show the hosting URL
    echo -e "${YELLOW}Opening your app in the browser...${NC}"
    firebase open hosting:site
fi

# Show functions logs hint
if [ "$DEPLOY_FUNCTIONS" = true ]; then
    echo ""
    echo -e "${CYAN}Tip: To view function logs, run:${NC}"
    echo -e "  firebase functions:log"
fi
