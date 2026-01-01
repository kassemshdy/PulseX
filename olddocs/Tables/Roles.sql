CREATE TABLE [dbo].[Roles] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [PublicId]       INT              IDENTITY (1, 1) NOT NULL,
    [Title]          NVARCHAR (150)   NOT NULL,
    [Description]    NVARCHAR (500)   NULL,
    [Status]         INT              CONSTRAINT [DF_Role_Status] DEFAULT ((20)) NOT NULL,
    [SubscriptionId] UNIQUEIDENTIFIER CONSTRAINT [DF_Roles_SubscriptionId] DEFAULT ('67B6364E-D75C-48BF-BC79-A850AC71885A') NOT NULL,
    CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Roles_Subscription] FOREIGN KEY ([SubscriptionId]) REFERENCES [dbo].[Subscription] ([Id])
);

