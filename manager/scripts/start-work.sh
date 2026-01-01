#!/bin/bash
# Helper script to start work on a story

STORY_ID=$1
if [ -z "$STORY_ID" ]; then
  echo "Usage: ./scripts/start-work.sh story-X"
  echo ""
  echo "Example: ./scripts/start-work.sh story-1"
  exit 1
fi

# Update story status to in-progress
node scripts/update-story.js $STORY_ID in-progress

if [ $? -eq 0 ]; then
  echo ""
  echo "🚀 Ready to work on $STORY_ID"
  echo "📝 When done, run: ./scripts/complete-work.sh $STORY_ID"
fi

