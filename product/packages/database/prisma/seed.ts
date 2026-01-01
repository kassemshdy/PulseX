import { PrismaClient, UserRole, PostStatus } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Create or get master subscription
  const subscription = await prisma.subscription.upsert({
    where: { code: 'master' },
    update: {},
    create: {
      code: 'master',
      name: 'Master Subscription',
      hosts: ['localhost:3000', 'localhost:3001'],
      master: true,
      landingPage: '/',
    },
  });

  console.log('✅ Created/found master subscription');

  // Create or get admin user
  const adminUser = await prisma.user.upsert({
    where: { 
      email_subscriptionId: {
        email: 'admin@pulsex.com',
        subscriptionId: subscription.id,
      }
    },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@pulsex.com',
      passwordHash: hashPassword('admin123456'),
      role: UserRole.ADMIN,
      language: 'en',
      isActive: true,
      subscriptionId: subscription.id,
    },
  });

  console.log('✅ Created/found admin user (admin@pulsex.com / admin123456)');

  // Create Article post type
  const articlePostType = await prisma.postType.create({
    data: {
      name: 'Article',
      slug: 'article',
      description: 'News articles and blog posts',
      icon: 'newspaper',
      fields: [
        {
          key: 'subtitle',
          label: 'Subtitle',
          type: 'text',
          required: false,
        },
        {
          key: 'source',
          label: 'Source',
          type: 'text',
          required: false,
        },
        {
          key: 'reading_time',
          label: 'Reading Time (minutes)',
          type: 'number',
          required: false,
        },
      ],
      supportedMedia: ['IMAGE', 'VIDEO', 'DOCUMENT'],
      isActive: true,
      subscriptionId: subscription.id,
    },
  });

  console.log('✅ Created Article post type');

  // Create Author post type (for dynamic author relations)
  const authorPostType = await prisma.postType.create({
    data: {
      name: 'Author',
      slug: 'author',
      description: 'Content authors',
      icon: 'user',
      fields: [
        {
          key: 'bio',
          label: 'Biography',
          type: 'textarea',
          required: false,
        },
        {
          key: 'twitter',
          label: 'Twitter Handle',
          type: 'text',
          required: false,
        },
        {
          key: 'linkedin',
          label: 'LinkedIn URL',
          type: 'url',
          required: false,
        },
      ],
      supportedMedia: ['IMAGE'],
      isActive: true,
      subscriptionId: subscription.id,
    },
  });

  console.log('✅ Created Author post type');

  // Create post type relation (Article -> Author)
  await prisma.postTypeRelation.create({
    data: {
      sourcePostTypeId: articlePostType.id,
      targetPostTypeId: authorPostType.id,
      name: 'author',
      relationType: 'ONE_TO_MANY',
      required: false,
      multiple: false,
    },
  });

  console.log('✅ Created Article-Author relation');

  // Create Category taxonomy
  const categoryTaxonomy = await prisma.taxonomy.create({
    data: {
      name: 'Category',
      slug: 'category',
      description: 'Content categories',
      isHierarchical: true,
      allowAutoAdd: false,
      isMain: true,
      excludeFromSearch: false,
      weight: 1,
      subscriptionId: subscription.id,
    },
  });

  console.log('✅ Created Category taxonomy');

  // Create Tag taxonomy
  const tagTaxonomy = await prisma.taxonomy.create({
    data: {
      name: 'Tag',
      slug: 'tag',
      description: 'Content tags',
      isHierarchical: false,
      allowAutoAdd: true,
      isMain: false,
      excludeFromSearch: false,
      weight: 2,
      subscriptionId: subscription.id,
    },
  });

  console.log('✅ Created Tag taxonomy');

  // Link taxonomies to post types
  await prisma.postTypeTaxonomy.createMany({
    data: [
      {
        postTypeId: articlePostType.id,
        taxonomyId: categoryTaxonomy.id,
        required: true,
        multiple: false,
      },
      {
        postTypeId: articlePostType.id,
        taxonomyId: tagTaxonomy.id,
        required: false,
        multiple: true,
      },
    ],
  });

  console.log('✅ Linked taxonomies to Article post type');

  // Create sample categories
  const techCategory = await prisma.term.create({
    data: {
      name: 'Technology',
      slug: 'technology',
      description: 'Technology news and updates',
      taxonomyId: categoryTaxonomy.id,
      count: 0,
      subscriptionId: subscription.id,
    },
  });

  await prisma.term.create({
    data: {
      name: 'Business',
      slug: 'business',
      description: 'Business and finance news',
      taxonomyId: categoryTaxonomy.id,
      count: 0,
      subscriptionId: subscription.id,
    },
  });

  console.log('✅ Created sample categories');

  // Create sample tags
  await prisma.term.createMany({
    data: [
      {
        name: 'JavaScript',
        slug: 'javascript',
        taxonomyId: tagTaxonomy.id,
        count: 0,
        subscriptionId: subscription.id,
      },
      {
        name: 'TypeScript',
        slug: 'typescript',
        taxonomyId: tagTaxonomy.id,
        count: 0,
        subscriptionId: subscription.id,
      },
      {
        name: 'Node.js',
        slug: 'nodejs',
        taxonomyId: tagTaxonomy.id,
        count: 0,
        subscriptionId: subscription.id,
      },
    ],
  });

  console.log('✅ Created sample tags');

  // Create a default theme
  const defaultTheme = await prisma.theme.create({
    data: {
      name: 'Default Theme',
      slug: 'default',
      description: 'The default CMS theme',
      version: '1.0.0',
      author: 'CMS Team',
      status: 'ACTIVE',
      settings: {
        colors: {
          primary: '#3B82F6',
          secondary: '#10B981',
          background: '#FFFFFF',
          text: '#1F2937',
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          fontSize: {
            base: '16px',
            h1: '2.5rem',
            h2: '2rem',
            h3: '1.75rem',
          },
        },
      },
      subscriptionId: subscription.id,
    },
  });

  console.log('✅ Created default theme');

  // Create homepage template
  const homeTemplate = await prisma.themeTemplate.create({
    data: {
      themeId: defaultTheme.id,
      name: 'Homepage',
      slug: 'homepage',
      type: 'page',
      description: 'Default homepage template',
      widgets: [
        {
          id: 'hero-1',
          widgetId: 'hero',
          zone: 'main',
          order: 1,
          dataSource: {
            type: 'dynamic',
            postTypeId: articlePostType.id,
            query: {
              limit: 1,
              orderBy: [{ field: 'publishedAt', direction: 'desc' }],
            },
          },
        },
        {
          id: 'articles-grid-1',
          widgetId: 'articles-grid',
          zone: 'main',
          order: 2,
          dataSource: {
            type: 'dynamic',
            postTypeId: articlePostType.id,
            query: {
              limit: 6,
              orderBy: [{ field: 'publishedAt', direction: 'desc' }],
            },
          },
        },
      ],
      settings: {},
    },
  });

  console.log('✅ Created homepage template');

  // Create homepage
  const homepage = await prisma.page.create({
    data: {
      title: 'Home',
      slug: '/',
      status: 'PUBLISHED',
      layout: {
        sections: [
          {
            id: 'hero-section',
            type: 'hero',
            settings: {
              height: 'large',
              overlay: true,
            },
          },
          {
            id: 'articles-section',
            type: 'grid',
            settings: {
              columns: 3,
              gap: 'medium',
            },
          },
        ],
      },
      seoTitle: 'Welcome to Our CMS',
      seoDescription: 'An enterprise-grade content management system built with TypeScript',
      templateId: homeTemplate.id,
      createdById: adminUser.id,
      subscriptionId: subscription.id,
    },
  });

  console.log('✅ Created homepage');

  // Create link for homepage
  await prisma.link.create({
    data: {
      publicLink: '/',
      resourceId: homepage.id,
      resourceType: 'page',
      cachingDuration: 3600,
      domains: ['localhost:3000'],
      subscriptionId: subscription.id,
    },
  });

  console.log('✅ Created homepage link');

  // Create some settings
  await prisma.setting.createMany({
    data: [
      {
        key: 'site_name',
        value: 'Enterprise CMS',
        category: 'general',
        subscriptionId: subscription.id,
      },
      {
        key: 'site_description',
        value: 'A powerful content management system',
        category: 'general',
        subscriptionId: subscription.id,
      },
      {
        key: 'posts_per_page',
        value: 10,
        category: 'content',
        subscriptionId: subscription.id,
      },
      {
        key: 'cache_enabled',
        value: true,
        category: 'performance',
        subscriptionId: subscription.id,
      },
    ],
  });

  console.log('✅ Created system settings');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

