#!/bin/bash
# Mark story as complete

STORY_ID=$1
if [ -z "$STORY_ID" ]; then
  echo "Usage: ./scripts/complete-work.sh story-X"
  echo ""
  echo "Example: ./scripts/complete-work.sh story-1"
  exit 1
fi

node scripts/update-story.js $STORY_ID done

if [ $? -eq 0 ]; then
  echo ""
  echo "🎉 Congratulations on completing $STORY_ID!"
fi

