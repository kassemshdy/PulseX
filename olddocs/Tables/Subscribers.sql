CREATE TABLE [dbo].[Subscribers] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [PublicId]       INT              IDENTITY (1, 1) NOT NULL,
    [Name]           NVARCHAR (250)   NULL,
    [Email]          NVARCHAR (250)   NULL,
    [Phone]          NVARCHAR (100)   NULL,
    [CreationDate]   DATETIME         NOT NULL,
    [Status]         INT              NOT NULL,
    [Token]          NVARCHAR (500)   NULL,
    [Topics]         NVARCHAR (500)   NULL,
    [Groups]         NVARCHAR (500)   NULL,
    [Services]       NVARCHAR (500)   NULL,
    [SubscriptionId] UNIQUEIDENTIFIER NOT NULL,
    [FrontUserId]    UNIQUEIDENTIFIER NULL,
    CONSTRAINT [PK_Subscribers] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Subscribers_Subscription] FOREIGN KEY ([SubscriptionId]) REFERENCES [dbo].[Subscription] ([Id])
);

