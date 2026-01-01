CREATE TABLE [dbo].[Taxonomy] (
    [Id]                UNIQUEIDENTIFIER NOT NULL,
    [PublicId]          INT              IDENTITY (1, 1) NOT NULL,
    [Name]              NVARCHAR (50)    NULL,
    [Code]              NVARCHAR (50)    NOT NULL,
    [Order]             INT              NOT NULL,
    [IsMain]            BIT              NOT NULL,
    [Status]            INT              NOT NULL,
    [AllowAutoAdd]      BIT              CONSTRAINT [DF_Taxonomy_AllowAutoAdd] DEFAULT ((0)) NOT NULL,
    [SubscriptionId]    UNIQUEIDENTIFIER CONSTRAINT [DF_Taxonomy_SubscriptionId] DEFAULT ('67B6364E-D75C-48BF-BC79-A850AC71885A') NOT NULL,
    [TermsTemplateId]   UNIQUEIDENTIFIER NULL,
    [PostsTemplateId]   UNIQUEIDENTIFIER NULL,
    [ExcludeFromSearch] BIT              DEFAULT ((0)) NOT NULL,
    [Weight]            INT              DEFAULT ((1)) NOT NULL,
    CONSTRAINT [PK_Taxonomy] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Taxonomy_Subscription] FOREIGN KEY ([SubscriptionId]) REFERENCES [dbo].[Subscription] ([Id])
);

