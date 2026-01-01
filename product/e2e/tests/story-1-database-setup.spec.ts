import { test, expect } from '@playwright/test';
import {
  checkDatabaseConnection,
  getTableCount,
  prisma,
  closeDatabaseConnection,
} from '../utils/database-helpers';

test.describe('Story 1: Database Schema & Migrations', () => {
  test.afterAll(async () => {
    await closeDatabaseConnection();
  });

  test('should connect to PostgreSQL database successfully', async () => {
    const isConnected = await checkDatabaseConnection();
    expect(isConnected).toBe(true);
  });

  test('should have all required tables created', async () => {
    const expectedTables = [
      'Subscription',
      'User',
      'Setting',
      'PostType',
      'Post',
      'PostMeta',
      'PostTypeRelation',
      'PostRelation',
      'Media',
      'PostMedia',
      'Taxonomy',
      'Term',
      'PostTerm',
      'PostTypeTaxonomy',
      'Page',
      'PageView',
      'Link',
      'Theme',
      'ThemeTemplate',
      'Widget',
      'Channel',
      'PublishedPost',
      'NotificationTopic',
      'AutomationRule',
      'Operation',
      'Glossary',
    ];

    for (const tableName of expectedTables) {
      const count = await getTableCount(tableName);
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should have seed data: master subscription', async () => {
    const masterSubscription = await prisma.subscription.findFirst({
      where: { master: true },
    });

    expect(masterSubscription).not.toBeNull();
    expect(masterSubscription?.code).toBe('master');
    expect(masterSubscription?.name).toBe('Master Subscription');
  });

  test('should have seed data: admin user', async () => {
    const masterSubscription = await prisma.subscription.findFirst({
      where: { master: true },
    });

    expect(masterSubscription).not.toBeNull();

    const adminUser = await prisma.user.findFirst({
      where: {
        subscriptionId: masterSubscription!.id,
        role: 'ADMIN',
      },
    });

    expect(adminUser).not.toBeNull();
    expect(adminUser?.email).toContain('@');
    expect(adminUser?.isActive).toBe(true);
  });

  test('should have seed data: PostTypes (Article, Author)', async () => {
    const postTypes = await prisma.postType.findMany();
    
    expect(postTypes.length).toBeGreaterThanOrEqual(2);

    const articleType = postTypes.find(pt => pt.name.toLowerCase().includes('article'));
    const authorType = postTypes.find(pt => pt.name.toLowerCase().includes('author'));

    expect(articleType).not.toBeUndefined();
    expect(authorType).not.toBeUndefined();
  });

  test('should have seed data: Taxonomies (Category, Tag)', async () => {
    const taxonomies = await prisma.taxonomy.findMany();
    
    expect(taxonomies.length).toBeGreaterThanOrEqual(2);

    const categoryTaxonomy = taxonomies.find(t => t.name.toLowerCase().includes('category'));
    const tagTaxonomy = taxonomies.find(t => t.name.toLowerCase().includes('tag'));

    expect(categoryTaxonomy).not.toBeUndefined();
    expect(tagTaxonomy).not.toBeUndefined();
  });

  test('should have seed data: Theme and ThemeTemplate', async () => {
    const themes = await prisma.theme.findMany();
    expect(themes.length).toBeGreaterThanOrEqual(1);

    const templates = await prisma.themeTemplate.findMany();
    expect(templates.length).toBeGreaterThanOrEqual(1);
  });

  test('should have proper foreign key relationships', async () => {
    const masterSubscription = await prisma.subscription.findFirst({
      where: { master: true },
      include: {
        users: true,
        postTypes: true,
      },
    });

    expect(masterSubscription).not.toBeNull();
    expect(masterSubscription?.users.length).toBeGreaterThan(0);
    expect(masterSubscription?.postTypes.length).toBeGreaterThan(0);
  });

  test('should support PostTypeRelation for dynamic relationships', async () => {
    const relations = await prisma.postTypeRelation.findMany();
    
    // Should have at least the Article -> Author relation from seed
    expect(relations.length).toBeGreaterThanOrEqual(1);

    const articleAuthorRelation = relations.find(r => r.name === 'author');
    expect(articleAuthorRelation).not.toBeUndefined();
    expect(articleAuthorRelation?.relationType).toBe('ONE_TO_MANY');
  });

  test('should have Links table for URL routing', async () => {
    const links = await prisma.link.findMany();
    expect(links.length).toBeGreaterThanOrEqual(0); // May be empty initially
  });

  test('should have Settings table', async () => {
    const settings = await prisma.setting.findMany();
    expect(settings.length).toBeGreaterThanOrEqual(0); // May be empty or have seed data
  });
});

