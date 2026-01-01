// Node script to update story status from CLI
const fs = require('fs');
const path = require('path');

const [,, storyId, newStatus] = process.argv;

if (!storyId || !newStatus) {
  console.error('Usage: node update-story.js <story-id> <status>');
  console.error('Status: backlog | todo | in-progress | review | done');
  process.exit(1);
}

const validStatuses = ['backlog', 'todo', 'in-progress', 'review', 'done'];
if (!validStatuses.includes(newStatus)) {
  console.error(`Invalid status: ${newStatus}`);
  console.error(`Valid statuses: ${validStatuses.join(', ')}`);
  process.exit(1);
}

const dbPath = path.join(__dirname, '../data/stories.json');

try {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const story = db.stories.find(s => s.id === storyId);

  if (!story) {
    console.error(`Story ${storyId} not found`);
    process.exit(1);
  }

  const oldStatus = story.status;
  story.status = newStatus;
  story.updatedAt = new Date().toISOString();

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  
  console.log(`✅ Updated ${storyId}: ${oldStatus} → ${newStatus}`);
  console.log(`📋 View at: http://localhost:3002`);
} catch (error) {
  console.error('Error updating story:', error.message);
  process.exit(1);
}

