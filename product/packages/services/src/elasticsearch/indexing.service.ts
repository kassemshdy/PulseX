import { ElasticsearchService } from './elasticsearch.service';
import { prisma, Post, Page, Term } from '@cms/database';

export class IndexingService {
  constructor(private esService: ElasticsearchService) {}

  async initializeIndices(): Promise<void> {
    // Create posts index
    await this.esService.createIndex('posts', {
      properties: {
        id: { type: 'keyword' },
        postTypeId: { type: 'keyword' },
        title: { type: 'text', analyzer: 'standard' },
        slug: { type: 'keyword' },
        content: { type: 'text', analyzer: 'standard' },
        excerpt: { type: 'text' },
        status: { type: 'keyword' },
        seoTitle: { type: 'text' },
        seoDescription: { type: 'text' },
        seoKeywords: { type: 'keyword' },
        publishedAt: { type: 'date' },
        subscriptionId: { type: 'keyword' },
        createdById: { type: 'keyword' },
        meta: { type: 'object', enabled: false },
        terms: {
          type: 'nested',
          properties: {
            id: { type: 'keyword' },
            taxonomyId: { type: 'keyword' },
            name: { type: 'text' },
            slug: { type: 'keyword' },
          },
        },
        media: {
          type: 'nested',
          properties: {
            id: { type: 'keyword' },
            url: { type: 'keyword' },
            type: { type: 'keyword' },
          },
        },
        viewCount: { type: 'integer' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' },
      },
    });

    // Create pages index
    await this.esService.createIndex('pages', {
      properties: {
        id: { type: 'keyword' },
        title: { type: 'text' },
        slug: { type: 'keyword' },
        status: { type: 'keyword' },
        layout: { type: 'object', enabled: false },
        theme: { type: 'object', enabled: false },
        subscriptionId: { type: 'keyword' },
        templateId: { type: 'keyword' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' },
      },
    });

    // Create terms index
    await this.esService.createIndex('terms', {
      properties: {
        id: { type: 'keyword' },
        taxonomyId: { type: 'keyword' },
        name: { type: 'text' },
        slug: { type: 'keyword' },
        description: { type: 'text' },
        count: { type: 'integer' },
        subscriptionId: { type: 'keyword' },
        createdAt: { type: 'date' },
      },
    });

    // Create subscriptions index (for configuration)
    await this.esService.createIndex('subscriptions', {
      properties: {
        id: { type: 'keyword' },
        code: { type: 'keyword' },
        name: { type: 'text' },
        hosts: { type: 'keyword' },
        settings: { type: 'object', enabled: false },
        createdAt: { type: 'date' },
      },
    });

    // Create links index (for routing)
    await this.esService.createIndex('links', {
      properties: {
        id: { type: 'keyword' },
        publicLink: { type: 'keyword' },
        resourceId: { type: 'keyword' },
        resourceType: { type: 'keyword' },
        subscriptionId: { type: 'keyword' },
        cachingDuration: { type: 'integer' },
        domains: { type: 'keyword' },
      },
    });

    // Create widgets index
    await this.esService.createIndex('widgets', {
      properties: {
        id: { type: 'keyword' },
        name: { type: 'text' },
        slug: { type: 'keyword' },
        status: { type: 'keyword' },
        dataSource: { type: 'object', enabled: false },
        viewOptions: { type: 'object', enabled: false },
        structure: { type: 'object', enabled: false },
        subscriptionId: { type: 'keyword' },
      },
    });

    // Create themes index
    await this.esService.createIndex('themes', {
      properties: {
        id: { type: 'keyword' },
        name: { type: 'text' },
        slug: { type: 'keyword' },
        status: { type: 'keyword' },
        settings: { type: 'object', enabled: false },
        subscriptionId: { type: 'keyword' },
      },
    });

    // Create templates index
    await this.esService.createIndex('templates', {
      properties: {
        id: { type: 'keyword' },
        themeId: { type: 'keyword' },
        name: { type: 'text' },
        slug: { type: 'keyword' },
        type: { type: 'keyword' },
        widgets: { type: 'object', enabled: false },
        settings: { type: 'object', enabled: false },
      },
    });
  }

  async indexPost(postId: string): Promise<void> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        meta: true,
        terms: {
          include: {
            term: {
              include: {
                taxonomy: true,
              },
            },
          },
        },
        media: {
          include: {
            media: true,
          },
        },
      },
    });

    if (!post) return;

    // Get view count from PageView
    const viewCount = await prisma.pageView.count({
      where: {
        entityType: 'post',
        entityId: postId,
      },
    });

    const document = {
      id: post.id,
      postTypeId: post.postTypeId,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      status: post.status,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      seoKeywords: post.seoKeywords,
      publishedAt: post.publishedAt,
      subscriptionId: post.subscriptionId,
      createdById: post.createdById,
      meta: post.meta.reduce((acc, m) => ({ ...acc, [m.key]: m.value }), {}),
      terms: post.terms.map((pt) => ({
        id: pt.term.id,
        taxonomyId: pt.term.taxonomyId,
        name: pt.term.name,
        slug: pt.term.slug,
      })),
      media: post.media.map((pm) => ({
        id: pm.media.id,
        url: pm.media.cdnUrl || pm.media.path,
        type: pm.media.type,
      })),
      viewCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    await this.esService.indexDocument('posts', post.id, document);
  }

  async indexAllPosts(subscriptionId: string): Promise<void> {
    const posts = await prisma.post.findMany({
      where: { subscriptionId },
      select: { id: true },
    });

    for (const post of posts) {
      await this.indexPost(post.id);
    }
  }

  async deletePost(postId: string): Promise<void> {
    await this.esService.deleteDocument('posts', postId);
  }

  async indexPage(pageId: string): Promise<void> {
    const page = await prisma.page.findUnique({
      where: { id: pageId },
    });

    if (!page) return;

    const document = {
      id: page.id,
      title: page.title,
      slug: page.slug,
      status: page.status,
      layout: page.layout,
      theme: page.theme,
      subscriptionId: page.subscriptionId,
      templateId: page.templateId,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };

    await this.esService.indexDocument('pages', page.id, document);
  }

  async indexTerm(termId: string): Promise<void> {
    const term = await prisma.term.findUnique({
      where: { id: termId },
    });

    if (!term) return;

    const document = {
      id: term.id,
      taxonomyId: term.taxonomyId,
      name: term.name,
      slug: term.slug,
      description: term.description,
      count: term.count,
      subscriptionId: term.subscriptionId,
      createdAt: term.createdAt,
    };

    await this.esService.indexDocument('terms', term.id, document);
  }

  async indexSubscription(subscriptionId: string): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) return;

    const document = {
      id: subscription.id,
      code: subscription.code,
      name: subscription.name,
      hosts: subscription.hosts,
      settings: subscription.settings,
      createdAt: subscription.createdAt,
    };

    await this.esService.indexDocument('subscriptions', subscription.id, document);
  }

  async indexAllConfiguration(subscriptionId: string): Promise<void> {
    // Index subscription
    await this.indexSubscription(subscriptionId);

    // Index all links
    const links = await prisma.link.findMany({
      where: { subscriptionId },
    });

    await this.esService.bulkIndex(
      'links',
      links.map((link) => ({
        id: link.id,
        document: {
          id: link.id,
          publicLink: link.publicLink,
          resourceId: link.resourceId,
          resourceType: link.resourceType,
          subscriptionId: link.subscriptionId,
          cachingDuration: link.cachingDuration,
          domains: link.domains,
        },
      }))
    );

    // Index all widgets
    const widgets = await prisma.widget.findMany({
      where: { subscriptionId },
    });

    await this.esService.bulkIndex(
      'widgets',
      widgets.map((widget) => ({
        id: widget.id,
        document: {
          id: widget.id,
          name: widget.name,
          slug: widget.slug,
          status: widget.status,
          dataSource: widget.dataSource,
          viewOptions: widget.viewOptions,
          structure: widget.structure,
          subscriptionId: widget.subscriptionId,
        },
      }))
    );

    // Index all themes and templates
    const themes = await prisma.theme.findMany({
      where: { subscriptionId },
      include: { templates: true },
    });

    await this.esService.bulkIndex(
      'themes',
      themes.map((theme) => ({
        id: theme.id,
        document: {
          id: theme.id,
          name: theme.name,
          slug: theme.slug,
          status: theme.status,
          settings: theme.settings,
          subscriptionId: theme.subscriptionId,
        },
      }))
    );

    const templates = themes.flatMap((theme) => theme.templates);
    await this.esService.bulkIndex(
      'templates',
      templates.map((template) => ({
        id: template.id,
        document: {
          id: template.id,
          themeId: template.themeId,
          name: template.name,
          slug: template.slug,
          type: template.type,
          widgets: template.widgets,
          settings: template.settings,
        },
      }))
    );
  }
}

