CREATE TABLE [dbo].[Packages] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [Title]          NVARCHAR (100)   NOT NULL,
    [Code]           NVARCHAR (100)   NOT NULL,
    [Description]    NVARCHAR (MAX)   NULL,
    [CreationDate]   DATETIME         NOT NULL,
    [Status]         INT              NOT NULL,
    [Price]          FLOAT (53)       NULL,
    [Discount]       FLOAT (53)       NULL,
    [Options]        NVARCHAR (MAX)   NULL,
    [SubscriptionId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [PK_Packages] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Packages_Subscription] FOREIGN KEY ([SubscriptionId]) REFERENCES [dbo].[Subscription] ([Id])
);

