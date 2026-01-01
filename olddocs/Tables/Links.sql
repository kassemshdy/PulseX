CREATE TABLE [dbo].[Links] (
    [Id]              UNIQUEIDENTIFIER NOT NULL,
    [PublicId]        INT              IDENTITY (1, 1) NOT NULL,
    [PublicLink]      NVARCHAR (1000)  NOT NULL,
    [PreviewUrl]      NVARCHAR (500)   NOT NULL,
    [Shortlink]       NVARCHAR (20)    NOT NULL,
    [ResourceId]      UNIQUEIDENTIFIER NULL,
    [Status]          INT              CONSTRAINT [DF_Links_Status] DEFAULT ((90)) NOT NULL,
    [CreationDate]    DATETIME         CONSTRAINT [DF_Links_CreationDate] DEFAULT (sysdatetime()) NOT NULL,
    [Canonical]       BIT              NOT NULL,
    [CachingDuration] INT              NOT NULL,
    [Rewrite]         BIT              DEFAULT ((0)) NOT NULL,
    [SubscriptionId]  UNIQUEIDENTIFIER CONSTRAINT [DF_Links_SubscriptionId] DEFAULT ('67B6364E-D75C-48BF-BC79-A850AC71885A') NOT NULL,
    [Domains]         NVARCHAR (500)   NULL,
    [RedirectTo]      NVARCHAR (1000)  NULL,
    [OldLink]         NVARCHAR (500)   NULL,
    [AmpLink]         NVARCHAR (1000)  NULL,
    [Language]        VARCHAR (50)     NULL,
    [YearUrl]         INT              NULL,
    [IdUrl]           INT              NULL,
    [TypeUrl]         NVARCHAR (50)    NULL,
    [TypeEnumUrl]     INT              NULL,
    [UrlKeyOld]       INT              NULL,
    [UrlKey]          INT              NULL,
    CONSTRAINT [PK_Links] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Links_Subscription] FOREIGN KEY ([SubscriptionId]) REFERENCES [dbo].[Subscription] ([Id])
);


GO
CREATE NONCLUSTERED INDEX [IX_Links_UrlKey]
    ON [dbo].[Links]([UrlKeyOld] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_Links_ResourceId]
    ON [dbo].[Links]([ResourceId] ASC)
    INCLUDE([PublicId], [PublicLink], [PreviewUrl], [Shortlink], [Status], [CreationDate], [Canonical], [CachingDuration], [Rewrite], [SubscriptionId], [Domains], [RedirectTo], [AmpLink], [Language]);

