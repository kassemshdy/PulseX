#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create symlink for Prisma client to work with pnpm
// Prisma expects .prisma/client relative to @prisma/client package
const prismaClientPath = path.join(
  __dirname,
  '..',
  'node_modules',
  '.pnpm',
  '@prisma+client@5.22.0',
  'node_modules',
  '@prisma',
  'client'
);

const pnpmPrismaPath = path.join(
  __dirname,
  '..',
  '..',
  'node_modules',
  '.pnpm',
  '@prisma+client@5.22.0_prisma@5.22.0',
  'node_modules',
  '.prisma'
);

const targetPath = path.join(prismaClientPath, 'node_modules', '.prisma');

try {
  // Check if source exists
  if (!fs.existsSync(pnpmPrismaPath)) {
    console.error('Prisma client not found in pnpm store. Run: pnpm prisma:generate');
    process.exit(1);
  }

  // Create node_modules directory in @prisma/client
  const nodeModulesPath = path.join(prismaClientPath, 'node_modules');
  fs.mkdirSync(nodeModulesPath, { recursive: true });

  // Remove existing symlink/directory
  if (fs.existsSync(targetPath)) {
    if (fs.lstatSync(targetPath).isSymbolicLink()) {
      fs.unlinkSync(targetPath);
    } else {
      fs.rmSync(targetPath, { recursive: true, force: true });
    }
  }

  // Create symlink
  fs.symlinkSync(pnpmPrismaPath, targetPath, 'dir');

  console.log('✅ Prisma client symlink created successfully');
  console.log(`   ${pnpmPrismaPath}`);
  console.log(`   -> ${targetPath}`);
} catch (error) {
  console.error('❌ Failed to create Prisma client symlink:', error.message);
  process.exit(1);
}

