CREATE TABLE [dbo].[Post] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [PublicId]       INT              IDENTITY (1, 1) NOT NULL,
    [Title]          NVARCHAR (256)   NULL,
    [Summary]        NVARCHAR (MAX)   NULL,
    [Content]        NVARCHAR (MAX)   NULL,
    [Order]          INT              CONSTRAINT [DF_Post_Order] DEFAULT ((0)) NOT NULL,
    [PostTypeId]     UNIQUEIDENTIFIER NOT NULL,
    [Status]         INT              CONSTRAINT [DF_Post_Status] DEFAULT ((10)) NOT NULL,
    [PostDate]       DATETIME         NULL,
    [CreationDate]   DATETIME         CONSTRAINT [DF_Post_CreationDate] DEFAULT (getutcdate()) NOT NULL,
    [LastModified]   DATETIME         CONSTRAINT [DF_Post_LastModified] DEFAULT (getutcdate()) NOT NULL,
    [CreatedBy]      UNIQUEIDENTIFIER NULL,
    [ModifiedBy]     UNIQUEIDENTIFIER NULL,
    [ParentId]       UNIQUEIDENTIFIER NULL,
    [PluginMeta]     NVARCHAR (MAX)   NULL,
    [PublicLink]     NVARCHAR (500)   NULL,
    [Views]          INT              CONSTRAINT [DF_Post_Views] DEFAULT ((0)) NOT NULL,
    [Shares]         INT              CONSTRAINT [DF_Post_Shares] DEFAULT ((0)) NOT NULL,
    [TemplateId]     UNIQUEIDENTIFIER NULL,
    [Widgets]        NVARCHAR (MAX)   NULL,
    [Notes]          NVARCHAR (MAX)   NULL,
    [ExpireDate]     DATETIME         NULL,
    [Platform]       NVARCHAR (250)   DEFAULT ('all') NOT NULL,
    [ShortTitle]     NVARCHAR (256)   NULL,
    [SubscriptionId] UNIQUEIDENTIFIER CONSTRAINT [DF_Post_SubscriptionId] DEFAULT ('67B6364E-D75C-48BF-BC79-A850AC71885A') NOT NULL,
    [Comments]       INT              DEFAULT ((0)) NULL,
    [Favorites]      INT              DEFAULT ((0)) NULL,
    [Rating]         FLOAT (53)       DEFAULT ((0)) NULL,
    [Raters]         INT              DEFAULT ((0)) NULL,
    [LastVisited]    DATETIME         NULL,
    [Style]          NVARCHAR (150)   NULL,
    [FrontUserId]    UNIQUEIDENTIFIER NULL,
    [PublishedBy]    UNIQUEIDENTIFIER NULL,
    [SeoSettings]    NVARCHAR (MAX)   NULL,
    [Packages]       NVARCHAR (256)   NULL,
    [IsIndexed]      BIT              DEFAULT ((0)) NULL,
    CONSTRAINT [PK_Post] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Post_CreatedBy] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_Post_ModifiedBy] FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_Post_ParentId] FOREIGN KEY ([ParentId]) REFERENCES [dbo].[Post] ([Id]),
    CONSTRAINT [FK_Post_PostTypeId] FOREIGN KEY ([PostTypeId]) REFERENCES [dbo].[PostType] ([Id]),
    CONSTRAINT [FK_Post_PublishedBy] FOREIGN KEY ([PublishedBy]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_Post_Subscription] FOREIGN KEY ([SubscriptionId]) REFERENCES [dbo].[Subscription] ([Id]),
    CONSTRAINT [FK_Post_TemplateId] FOREIGN KEY ([TemplateId]) REFERENCES [dbo].[Post] ([Id])
);


GO
ALTER TABLE [dbo].[Post] NOCHECK CONSTRAINT [FK_Post_CreatedBy];


GO
ALTER TABLE [dbo].[Post] NOCHECK CONSTRAINT [FK_Post_ModifiedBy];


GO
ALTER TABLE [dbo].[Post] NOCHECK CONSTRAINT [FK_Post_ParentId];


GO
ALTER TABLE [dbo].[Post] NOCHECK CONSTRAINT [FK_Post_PostTypeId];


GO
ALTER TABLE [dbo].[Post] NOCHECK CONSTRAINT [FK_Post_PublishedBy];


GO
ALTER TABLE [dbo].[Post] NOCHECK CONSTRAINT [FK_Post_Subscription];


GO
ALTER TABLE [dbo].[Post] NOCHECK CONSTRAINT [FK_Post_TemplateId];


GO
CREATE NONCLUSTERED INDEX [IX_Post_SubscriptionId_PostTypeId_Status]
    ON [dbo].[Post]([SubscriptionId] ASC, [PostTypeId] ASC, [Status] ASC)
    INCLUDE([Title], [CreationDate]);


GO
CREATE NONCLUSTERED INDEX [IX_Post_Status_SubscriptionId_PublicId_PostTypeId_PostDate_ExpireDate]
    ON [dbo].[Post]([Status] ASC, [SubscriptionId] ASC, [PublicId] ASC, [PostTypeId] ASC, [PostDate] ASC, [ExpireDate] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_Post_Status_SubscriptionId_PostDate_ExpireDate]
    ON [dbo].[Post]([Status] ASC, [SubscriptionId] ASC, [PostDate] ASC, [ExpireDate] ASC)
    INCLUDE([Order], [PostTypeId], [Views]);


GO
CREATE NONCLUSTERED INDEX [IX_Post_Status_PostDate_ExpireDate]
    ON [dbo].[Post]([Status] ASC, [PostDate] ASC, [ExpireDate] ASC)
    INCLUDE([Order], [PostTypeId]);


GO
CREATE NONCLUSTERED INDEX [IX_Post_PublicId]
    ON [dbo].[Post]([PublicId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_Post_PostTypeId_Status_SubscriptionId_PublicId_PostDate_ExpireDate]
    ON [dbo].[Post]([PostTypeId] ASC, [Status] ASC, [SubscriptionId] ASC, [PublicId] ASC, [PostDate] ASC, [ExpireDate] ASC)
    INCLUDE([Order]);


GO
CREATE NONCLUSTERED INDEX [IX_Post_PostTypeId_Status_SubscriptionId_PostDate_ExpireDate]
    ON [dbo].[Post]([PostTypeId] ASC, [Status] ASC, [SubscriptionId] ASC, [PostDate] ASC, [ExpireDate] ASC)
    INCLUDE([Order], [Views]);


GO
CREATE NONCLUSTERED INDEX [IX_Post_PostTypeId_Status]
    ON [dbo].[Post]([PostTypeId] ASC, [Status] ASC)
    INCLUDE([CreationDate]);


GO
CREATE NONCLUSTERED INDEX [IX_Post_ParentId]
    ON [dbo].[Post]([ParentId] ASC);

