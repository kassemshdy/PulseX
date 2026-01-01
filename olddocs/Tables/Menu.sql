CREATE TABLE [dbo].[Menu] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [PublicId]       INT              IDENTITY (1, 1) NOT NULL,
    [Title]          NVARCHAR (150)   NULL,
    [Url]            NVARCHAR (250)   NULL,
    [Controller]     NVARCHAR (250)   NULL,
    [Action]         NVARCHAR (250)   NULL,
    [Area]           VARCHAR (50)     NULL,
    [Parameters]     NVARCHAR (MAX)   NULL,
    [ParentId]       UNIQUEIDENTIFIER NULL,
    [Order]          INT              NOT NULL,
    [Status]         INT              NOT NULL,
    [Options]        NVARCHAR (MAX)   NULL,
    [Location]       VARCHAR (250)    NULL,
    [SubscriptionId] UNIQUEIDENTIFIER CONSTRAINT [DF_Menu_SubscriptionId] DEFAULT ('67B6364E-D75C-48BF-BC79-A850AC71885A') NOT NULL,
    CONSTRAINT [PK_Menu] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (FILLFACTOR = 100),
    CONSTRAINT [FK_Menu_ParentId] FOREIGN KEY ([ParentId]) REFERENCES [dbo].[Menu] ([Id]),
    CONSTRAINT [FK_Menu_Subscription] FOREIGN KEY ([SubscriptionId]) REFERENCES [dbo].[Subscription] ([Id])
);

