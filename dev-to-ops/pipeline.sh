#!/bin/bash
set -e
APP_NAME="helix-ide"
APP_PATH="/Users/christianroe"
GREEN='\033[0;32m'
NC='\033[0m'
log() { echo -e "${GREEN}[$(date '+%H:%M')]${NC} $1"; }

case "${1:-help}" in
    dev)    log "Dev mode for $APP_NAME" ;;
    build)  log "Build $APP_NAME" ;;
    test)   log "Test $APP_NAME" ;;
    deploy) log "Deploy $APP_NAME" ;;
    verify) log "Verify $APP_NAME" ;;
    *)      echo "Usage: $0 <dev|build|test|deploy|verify>" ;;
esac
