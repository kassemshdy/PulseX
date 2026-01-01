CREATE TABLE [dbo].[Impressions] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [PublicId]       INT              IDENTITY (1, 1) NOT NULL,
    [Status]         INT              CONSTRAINT [DF_PostImp_Status] DEFAULT ((10)) NOT NULL,
    [CreationDate]   DATETIME         NOT NULL,
    [LastModified]   DATETIME         NULL,
    [ResourceId]     UNIQUEIDENTIFIER NOT NULL,
    [UserId]         UNIQUEIDENTIFIER NOT NULL,
    [Type]           INT              NULL,
    [Value]          INT              NULL,
    [SubscriptionId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [PK_PostImp] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Impression_Subscription] FOREIGN KEY ([SubscriptionId]) REFERENCES [dbo].[Subscription] ([Id]),
    CONSTRAINT [relatedUserPost] FOREIGN KEY ([UserId]) REFERENCES [dbo].[FrontUser] ([Id])
);

