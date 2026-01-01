CREATE TABLE [dbo].[Term] (
    [Id]                 UNIQUEIDENTIFIER NOT NULL,
    [PublicId]           INT              IDENTITY (1, 1) NOT NULL,
    [Code]               NVARCHAR (255)   NOT NULL,
    [Name]               NVARCHAR (255)   NULL,
    [Status]             INT              NOT NULL,
    [Order]              INT              NOT NULL,
    [TaxonomyId]         UNIQUEIDENTIFIER NOT NULL,
    [ParentId]           UNIQUEIDENTIFIER NULL,
    [CreationDate]       DATETIME         NOT NULL,
    [LastModified]       DATETIME         NULL,
    [Count]              INT              CONSTRAINT [DF_Term_Count] DEFAULT ((0)) NOT NULL,
    [MediaItemId]        UNIQUEIDENTIFIER NULL,
    [MetaData]           NVARCHAR (MAX)   NULL,
    [SubscriptionId]     UNIQUEIDENTIFIER CONSTRAINT [DF_Term_SubscriptionId] DEFAULT ('67B6364E-D75C-48BF-BC79-A850AC71885A') NOT NULL,
    [TaxonomyTemplateId] UNIQUEIDENTIFIER NULL,
    [PostTypeTemplateId] UNIQUEIDENTIFIER NULL,
    [DetailsTemplateId]  UNIQUEIDENTIFIER NULL,
    [Weight]             INT              DEFAULT ((1)) NOT NULL,
    CONSTRAINT [PK_Term] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Term_DetailsTemplate] FOREIGN KEY ([DetailsTemplateId]) REFERENCES [dbo].[Post] ([Id]),
    CONSTRAINT [FK_Term_MediaItemId] FOREIGN KEY ([MediaItemId]) REFERENCES [dbo].[MediaItem] ([Id]),
    CONSTRAINT [FK_Term_ParentId] FOREIGN KEY ([ParentId]) REFERENCES [dbo].[Term] ([Id]),
    CONSTRAINT [FK_Term_PostTypeTemplate] FOREIGN KEY ([PostTypeTemplateId]) REFERENCES [dbo].[Post] ([Id]),
    CONSTRAINT [FK_Term_Subscription] FOREIGN KEY ([SubscriptionId]) REFERENCES [dbo].[Subscription] ([Id]),
    CONSTRAINT [FK_Term_TaxonomyId] FOREIGN KEY ([TaxonomyId]) REFERENCES [dbo].[Taxonomy] ([Id]),
    CONSTRAINT [FK_Term_TaxonomyTemplate] FOREIGN KEY ([TaxonomyTemplateId]) REFERENCES [dbo].[Post] ([Id])
);


GO
CREATE NONCLUSTERED INDEX [IX_Term_Status_TaxonomyId]
    ON [dbo].[Term]([Status] ASC, [TaxonomyId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_Term_Code]
    ON [dbo].[Term]([Code] ASC);

