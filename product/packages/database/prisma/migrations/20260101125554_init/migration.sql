-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED', 'TRASH');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaRelationType" AS ENUM ('FEATURED', 'GALLERY', 'THUMBNAIL', 'ATTACHMENT', 'INLINE');

-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('ONE_TO_ONE', 'ONE_TO_MANY', 'MANY_TO_MANY');

-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ThemeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT');

-- CreateEnum
CREATE TYPE "WidgetStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT');

-- CreateEnum
CREATE TYPE "WidgetPlatform" AS ENUM ('WEB', 'MOBILE', 'AMP', 'ALL');

-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('VIDEO_UPLOAD', 'VIDEO_TRANSCODE', 'IMAGE_PROCESS', 'SOCIAL_PUBLISH', 'NOTIFICATION_SEND', 'CONTENT_INDEX', 'CACHE_WARM', 'EXPORT_DATA', 'IMPORT_DATA');

-- CreateEnum
CREATE TYPE "OperationStatus" AS ENUM ('PENDING', 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'RETRYING');

-- CreateEnum
CREATE TYPE "OperationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('FACEBOOK', 'TWITTER', 'INSTAGRAM', 'YOUTUBE', 'TELEGRAM', 'LINKEDIN');

-- CreateEnum
CREATE TYPE "ChannelStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED', 'ERROR');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hosts" TEXT[],
    "master" BOOLEAN NOT NULL DEFAULT false,
    "landingPage" TEXT,
    "logoId" TEXT,
    "logoIconId" TEXT,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "language" TEXT DEFAULT 'en',
    "avatarId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "fields" JSONB NOT NULL,
    "supportedMedia" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "postTypeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT,
    "excerpt" TEXT,
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT[],
    "ogImage" TEXT,
    "publishedAt" TIMESTAMP(3),
    "scheduledFor" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_meta" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "size" BIGINT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "path" TEXT NOT NULL,
    "cdnUrl" TEXT,
    "thumbnailUrl" TEXT,
    "alt" TEXT,
    "caption" TEXT,
    "description" TEXT,
    "tags" TEXT[],
    "hash" TEXT,
    "storage" TEXT NOT NULL DEFAULT 'local',
    "isExternal" BOOLEAN NOT NULL DEFAULT false,
    "externalUrl" TEXT,
    "metadata" JSONB,
    "uploadedById" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_media" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "relationType" "MediaRelationType" NOT NULL DEFAULT 'ATTACHMENT',
    "order" INTEGER NOT NULL DEFAULT 0,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxonomies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isHierarchical" BOOLEAN NOT NULL DEFAULT false,
    "allowAutoAdd" BOOLEAN NOT NULL DEFAULT false,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "excludeFromSearch" BOOLEAN NOT NULL DEFAULT false,
    "weight" INTEGER DEFAULT 0,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "taxonomies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms" (
    "id" TEXT NOT NULL,
    "taxonomyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "count" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_terms" (
    "postId" TEXT NOT NULL,
    "termId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_terms_pkey" PRIMARY KEY ("postId","termId")
);

-- CreateTable
CREATE TABLE "post_type_taxonomies" (
    "id" TEXT NOT NULL,
    "postTypeId" TEXT NOT NULL,
    "taxonomyId" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "multiple" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_type_taxonomies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_type_relations" (
    "id" TEXT NOT NULL,
    "sourcePostTypeId" TEXT NOT NULL,
    "targetPostTypeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationType" "RelationType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "multiple" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_type_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_relations" (
    "id" TEXT NOT NULL,
    "sourcePostId" TEXT NOT NULL,
    "targetPostId" TEXT NOT NULL,
    "relationType" TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "PageStatus" NOT NULL DEFAULT 'DRAFT',
    "layout" JSONB NOT NULL,
    "theme" JSONB,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT[],
    "ogImage" TEXT,
    "templateId" TEXT,
    "createdById" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "themes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL,
    "author" TEXT,
    "thumbnail" TEXT,
    "status" "ThemeStatus" NOT NULL DEFAULT 'DRAFT',
    "settings" JSONB NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theme_templates" (
    "id" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "widgets" JSONB NOT NULL,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theme_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "widgets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "WidgetStatus" NOT NULL DEFAULT 'DRAFT',
    "dataSource" JSONB NOT NULL,
    "viewOptions" JSONB NOT NULL,
    "platform" "WidgetPlatform" NOT NULL DEFAULT 'ALL',
    "target" TEXT,
    "structure" JSONB NOT NULL,
    "cacheDuration" INTEGER,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "widgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL,
    "publicLink" TEXT NOT NULL,
    "shortlink" TEXT,
    "resourceId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "redirectTo" TEXT,
    "ampLink" TEXT,
    "canonical" TEXT,
    "cachingDuration" INTEGER,
    "domains" TEXT[],
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_views" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entitySlug" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "referrer" TEXT,
    "country" TEXT,
    "duration" INTEGER,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operations" (
    "id" TEXT NOT NULL,
    "type" "OperationType" NOT NULL,
    "status" "OperationStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "OperationPriority" NOT NULL DEFAULT 'NORMAL',
    "resourceId" TEXT,
    "resourceType" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "currentState" TEXT,
    "parameters" JSONB,
    "result" JSONB,
    "error" JSONB,
    "logs" JSONB[],
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "estimatedCompletion" TIMESTAMP(3),
    "subscriptionId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "platformAccountId" TEXT NOT NULL,
    "accountHandle" TEXT NOT NULL,
    "credentials" JSONB NOT NULL,
    "status" "ChannelStatus" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "groupName" TEXT,
    "lastSyncAt" TIMESTAMP(3),
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "published_posts" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "platformPostId" TEXT NOT NULL,
    "contentSnapshot" JSONB NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "metrics" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "published_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "triggers" JSONB[],
    "conditions" JSONB[],
    "actions" JSONB[],
    "schedule" JSONB,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "automation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_topics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "subscriberCount" INTEGER NOT NULL DEFAULT 0,
    "conditions" JSONB,
    "template" JSONB,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "glossary" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "glossary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "category" TEXT,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_code_key" ON "subscriptions"("code");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_subscriptionId_idx" ON "users"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_subscriptionId_key" ON "users"("email", "subscriptionId");

-- CreateIndex
CREATE INDEX "post_types_subscriptionId_idx" ON "post_types"("subscriptionId");

-- CreateIndex
CREATE INDEX "post_types_slug_idx" ON "post_types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "post_types_slug_subscriptionId_key" ON "post_types"("slug", "subscriptionId");

-- CreateIndex
CREATE INDEX "posts_postTypeId_idx" ON "posts"("postTypeId");

-- CreateIndex
CREATE INDEX "posts_status_idx" ON "posts"("status");

-- CreateIndex
CREATE INDEX "posts_publishedAt_idx" ON "posts"("publishedAt");

-- CreateIndex
CREATE INDEX "posts_subscriptionId_idx" ON "posts"("subscriptionId");

-- CreateIndex
CREATE INDEX "posts_createdById_idx" ON "posts"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_postTypeId_subscriptionId_key" ON "posts"("slug", "postTypeId", "subscriptionId");

-- CreateIndex
CREATE INDEX "post_meta_postId_idx" ON "post_meta"("postId");

-- CreateIndex
CREATE INDEX "post_meta_key_idx" ON "post_meta"("key");

-- CreateIndex
CREATE UNIQUE INDEX "post_meta_postId_key_key" ON "post_meta"("postId", "key");

-- CreateIndex
CREATE INDEX "media_type_idx" ON "media"("type");

-- CreateIndex
CREATE INDEX "media_subscriptionId_idx" ON "media"("subscriptionId");

-- CreateIndex
CREATE INDEX "media_uploadedById_idx" ON "media"("uploadedById");

-- CreateIndex
CREATE INDEX "post_media_postId_idx" ON "post_media"("postId");

-- CreateIndex
CREATE INDEX "post_media_mediaId_idx" ON "post_media"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "post_media_postId_mediaId_relationType_key" ON "post_media"("postId", "mediaId", "relationType");

-- CreateIndex
CREATE INDEX "taxonomies_subscriptionId_idx" ON "taxonomies"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "taxonomies_slug_subscriptionId_key" ON "taxonomies"("slug", "subscriptionId");

-- CreateIndex
CREATE INDEX "terms_taxonomyId_idx" ON "terms"("taxonomyId");

-- CreateIndex
CREATE INDEX "terms_parentId_idx" ON "terms"("parentId");

-- CreateIndex
CREATE INDEX "terms_subscriptionId_idx" ON "terms"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "terms_slug_taxonomyId_key" ON "terms"("slug", "taxonomyId");

-- CreateIndex
CREATE INDEX "post_terms_postId_idx" ON "post_terms"("postId");

-- CreateIndex
CREATE INDEX "post_terms_termId_idx" ON "post_terms"("termId");

-- CreateIndex
CREATE INDEX "post_type_taxonomies_postTypeId_idx" ON "post_type_taxonomies"("postTypeId");

-- CreateIndex
CREATE INDEX "post_type_taxonomies_taxonomyId_idx" ON "post_type_taxonomies"("taxonomyId");

-- CreateIndex
CREATE UNIQUE INDEX "post_type_taxonomies_postTypeId_taxonomyId_key" ON "post_type_taxonomies"("postTypeId", "taxonomyId");

-- CreateIndex
CREATE INDEX "post_type_relations_sourcePostTypeId_idx" ON "post_type_relations"("sourcePostTypeId");

-- CreateIndex
CREATE INDEX "post_type_relations_targetPostTypeId_idx" ON "post_type_relations"("targetPostTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "post_type_relations_sourcePostTypeId_targetPostTypeId_name_key" ON "post_type_relations"("sourcePostTypeId", "targetPostTypeId", "name");

-- CreateIndex
CREATE INDEX "post_relations_sourcePostId_idx" ON "post_relations"("sourcePostId");

-- CreateIndex
CREATE INDEX "post_relations_targetPostId_idx" ON "post_relations"("targetPostId");

-- CreateIndex
CREATE UNIQUE INDEX "post_relations_sourcePostId_targetPostId_relationType_key" ON "post_relations"("sourcePostId", "targetPostId", "relationType");

-- CreateIndex
CREATE INDEX "pages_status_idx" ON "pages"("status");

-- CreateIndex
CREATE INDEX "pages_subscriptionId_idx" ON "pages"("subscriptionId");

-- CreateIndex
CREATE INDEX "pages_createdById_idx" ON "pages"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_subscriptionId_key" ON "pages"("slug", "subscriptionId");

-- CreateIndex
CREATE INDEX "themes_subscriptionId_idx" ON "themes"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "themes_slug_subscriptionId_key" ON "themes"("slug", "subscriptionId");

-- CreateIndex
CREATE INDEX "theme_templates_themeId_idx" ON "theme_templates"("themeId");

-- CreateIndex
CREATE UNIQUE INDEX "theme_templates_themeId_slug_key" ON "theme_templates"("themeId", "slug");

-- CreateIndex
CREATE INDEX "widgets_subscriptionId_idx" ON "widgets"("subscriptionId");

-- CreateIndex
CREATE INDEX "widgets_status_idx" ON "widgets"("status");

-- CreateIndex
CREATE UNIQUE INDEX "widgets_slug_subscriptionId_key" ON "widgets"("slug", "subscriptionId");

-- CreateIndex
CREATE INDEX "links_resourceId_resourceType_idx" ON "links"("resourceId", "resourceType");

-- CreateIndex
CREATE INDEX "links_subscriptionId_idx" ON "links"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "links_publicLink_subscriptionId_key" ON "links"("publicLink", "subscriptionId");

-- CreateIndex
CREATE INDEX "page_views_entityId_entityType_idx" ON "page_views"("entityId", "entityType");

-- CreateIndex
CREATE INDEX "page_views_sessionId_idx" ON "page_views"("sessionId");

-- CreateIndex
CREATE INDEX "page_views_viewedAt_idx" ON "page_views"("viewedAt");

-- CreateIndex
CREATE INDEX "operations_type_idx" ON "operations"("type");

-- CreateIndex
CREATE INDEX "operations_status_idx" ON "operations"("status");

-- CreateIndex
CREATE INDEX "operations_priority_idx" ON "operations"("priority");

-- CreateIndex
CREATE INDEX "operations_resourceId_resourceType_idx" ON "operations"("resourceId", "resourceType");

-- CreateIndex
CREATE INDEX "operations_subscriptionId_idx" ON "operations"("subscriptionId");

-- CreateIndex
CREATE INDEX "operations_createdById_idx" ON "operations"("createdById");

-- CreateIndex
CREATE INDEX "channels_subscriptionId_idx" ON "channels"("subscriptionId");

-- CreateIndex
CREATE INDEX "channels_status_idx" ON "channels"("status");

-- CreateIndex
CREATE UNIQUE INDEX "channels_platform_platformAccountId_subscriptionId_key" ON "channels"("platform", "platformAccountId", "subscriptionId");

-- CreateIndex
CREATE INDEX "published_posts_contentId_idx" ON "published_posts"("contentId");

-- CreateIndex
CREATE INDEX "published_posts_channelId_idx" ON "published_posts"("channelId");

-- CreateIndex
CREATE INDEX "published_posts_status_idx" ON "published_posts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "published_posts_contentId_channelId_key" ON "published_posts"("contentId", "channelId");

-- CreateIndex
CREATE INDEX "automation_rules_subscriptionId_idx" ON "automation_rules"("subscriptionId");

-- CreateIndex
CREATE INDEX "automation_rules_isActive_idx" ON "automation_rules"("isActive");

-- CreateIndex
CREATE INDEX "notification_topics_subscriptionId_idx" ON "notification_topics"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_topics_slug_subscriptionId_key" ON "notification_topics"("slug", "subscriptionId");

-- CreateIndex
CREATE INDEX "glossary_resourceId_resourceType_idx" ON "glossary"("resourceId", "resourceType");

-- CreateIndex
CREATE INDEX "glossary_language_idx" ON "glossary"("language");

-- CreateIndex
CREATE INDEX "glossary_subscriptionId_idx" ON "glossary"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "glossary_resourceId_resourceType_field_language_key" ON "glossary"("resourceId", "resourceType", "field", "language");

-- CreateIndex
CREATE INDEX "settings_category_idx" ON "settings"("category");

-- CreateIndex
CREATE INDEX "settings_subscriptionId_idx" ON "settings"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_subscriptionId_key" ON "settings"("key", "subscriptionId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_types" ADD CONSTRAINT "post_types_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_postTypeId_fkey" FOREIGN KEY ("postTypeId") REFERENCES "post_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_meta" ADD CONSTRAINT "post_meta_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_media" ADD CONSTRAINT "post_media_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_media" ADD CONSTRAINT "post_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxonomies" ADD CONSTRAINT "taxonomies_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terms" ADD CONSTRAINT "terms_taxonomyId_fkey" FOREIGN KEY ("taxonomyId") REFERENCES "taxonomies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terms" ADD CONSTRAINT "terms_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "terms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terms" ADD CONSTRAINT "terms_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_terms" ADD CONSTRAINT "post_terms_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_terms" ADD CONSTRAINT "post_terms_termId_fkey" FOREIGN KEY ("termId") REFERENCES "terms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_type_taxonomies" ADD CONSTRAINT "post_type_taxonomies_postTypeId_fkey" FOREIGN KEY ("postTypeId") REFERENCES "post_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_type_taxonomies" ADD CONSTRAINT "post_type_taxonomies_taxonomyId_fkey" FOREIGN KEY ("taxonomyId") REFERENCES "taxonomies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_type_relations" ADD CONSTRAINT "post_type_relations_sourcePostTypeId_fkey" FOREIGN KEY ("sourcePostTypeId") REFERENCES "post_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_type_relations" ADD CONSTRAINT "post_type_relations_targetPostTypeId_fkey" FOREIGN KEY ("targetPostTypeId") REFERENCES "post_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_relations" ADD CONSTRAINT "post_relations_sourcePostId_fkey" FOREIGN KEY ("sourcePostId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_relations" ADD CONSTRAINT "post_relations_targetPostId_fkey" FOREIGN KEY ("targetPostId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "theme_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "themes" ADD CONSTRAINT "themes_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theme_templates" ADD CONSTRAINT "theme_templates_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "widgets" ADD CONSTRAINT "widgets_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_post_fkey" FOREIGN KEY ("resourceId") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_media_fkey" FOREIGN KEY ("resourceId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "published_posts" ADD CONSTRAINT "published_posts_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "published_posts" ADD CONSTRAINT "published_posts_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_rules" ADD CONSTRAINT "automation_rules_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_topics" ADD CONSTRAINT "notification_topics_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "glossary" ADD CONSTRAINT "glossary_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
