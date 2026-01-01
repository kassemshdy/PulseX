export const TEST_USERS = {
  user1: {
    email: 'e2e-test-user1@example.com',
    password: 'TestPass123!',
    siteName: 'E2E Test Site 1',
  },
  user2: {
    email: 'e2e-test-user2@example.com',
    password: 'TestPass456!',
    siteName: 'E2E Test Site 2',
  },
  user3: {
    email: 'e2e-test-user3@example.com',
    password: 'TestPass789!',
    siteName: 'E2E Test Site 3',
  },
};

export const RESERVED_SUBDOMAINS = [
  'www',
  'admin',
  'api',
  'app',
  'mail',
  'ftp',
  'localhost',
  'staging',
  'dev',
  'test',
  'demo',
  'support',
  'help',
  'blog',
  'shop',
  'store',
  'cdn',
  'static',
  'assets',
];

export const INVALID_EMAILS = [
  'notanemail',
  '@example.com',
  'user@',
  'user @example.com',
  'user@example',
];

export const INVALID_PASSWORDS = [
  'short',           // Too short
  'nouppercase1',    // No uppercase
  'NOLOWERCASE1',    // No lowercase
  'NoNumbers',       // No numbers
];

export const INVALID_SUBDOMAINS = [
  'ab',              // Too short (< 3 chars)
  'a',               // Too short
  'this-is-a-very-long-subdomain-name', // Too long (> 20 chars)
  'test_site',       // Invalid character (underscore)
  'test site',       // Invalid character (space)
  'Test-Site',       // Uppercase not allowed
  '-testsite',       // Cannot start with hyphen
  'testsite-',       // Cannot end with hyphen
];

