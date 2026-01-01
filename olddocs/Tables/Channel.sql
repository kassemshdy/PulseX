CREATE TABLE [dbo].[Channel] (
    [Id]              UNIQUEIDENTIFIER NOT NULL,
    [Name]            NVARCHAR (256)   NULL,
    [Description]     NVARCHAR (MAX)   NULL,
    [Status]          INT              NOT NULL,
    [CreationDate]    DATETIME         NOT NULL,
    [LastModified]    DATETIME         NOT NULL,
    [Network]         NVARCHAR (MAX)   NOT NULL,
    [Account]         NVARCHAR (MAX)   NOT NULL,
    [NetworkId]       NVARCHAR (MAX)   NOT NULL,
    [OriginalName]    NVARCHAR (MAX)   NULL,
    [ProfileImageUrl] NVARCHAR (MAX)   NULL,
    [Credentials]     NVARCHAR (MAX)   NULL,
    [SubscriptionId]  UNIQUEIDENTIFIER NOT NULL,
    [Settings]        NVARCHAR (MAX)   NULL,
    [NetworkUrl]      NVARCHAR (MAX)   NULL,
    [Code]            NVARCHAR (265)   NULL,
    [Order]           INT              NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Channel_ToSubscription] FOREIGN KEY ([SubscriptionId]) REFERENCES [dbo].[Subscription] ([Id])
);

