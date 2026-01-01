CREATE TABLE [dbo].[Widgets] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [PublicId]       INT              IDENTITY (1, 1) NOT NULL,
    [Status]         INT              CONSTRAINT [DF_Widget_Status] DEFAULT ((20)) NOT NULL,
    [Description]    NVARCHAR (250)   NULL,
    [CreationDate]   DATETIME         NOT NULL,
    [LastModified]   DATETIME         NULL,
    [Order]          INT              NOT NULL,
    [MainContent]    BIT              NOT NULL,
    [DataSource]     NVARCHAR (MAX)   NULL,
    [ViewOptions]    NVARCHAR (MAX)   NULL,
    [Platform]       NVARCHAR (250)   DEFAULT ('all') NOT NULL,
    [Target]         NVARCHAR (MAX)   NULL,
    [Structure]      NVARCHAR (MAX)   NULL,
    [SubscriptionId] UNIQUEIDENTIFIER CONSTRAINT [DF_Widgets_SubscriptionId] DEFAULT ('67B6364E-D75C-48BF-BC79-A850AC71885A') NOT NULL,
    [Code]           NVARCHAR (250)   NULL,
    CONSTRAINT [PK_Widgets] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (FILLFACTOR = 100),
    CONSTRAINT [FK_Widgets_Subscription] FOREIGN KEY ([SubscriptionId]) REFERENCES [dbo].[Subscription] ([Id])
);

