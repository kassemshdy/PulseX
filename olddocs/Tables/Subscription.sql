CREATE TABLE [dbo].[Subscription] (
    [Id]           UNIQUEIDENTIFIER NOT NULL,
    [PublicId]     INT              IDENTITY (1, 1) NOT NULL,
    [Code]         NVARCHAR (50)    NOT NULL,
    [Name]         NVARCHAR (50)    NULL,
    [Status]       INT              NULL,
    [CreationDate] DATETIME         DEFAULT (getutcdate()) NOT NULL,
    [Hosts]        NVARCHAR (MAX)   NULL,
    [Master]       BIT              DEFAULT ((0)) NOT NULL,
    [LandingPage]  UNIQUEIDENTIFIER NULL,
    [LogoId]       UNIQUEIDENTIFIER NULL,
    [LogoIconId]   UNIQUEIDENTIFIER NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Subscription_LogoIconId] FOREIGN KEY ([LogoIconId]) REFERENCES [dbo].[MediaItem] ([Id]),
    CONSTRAINT [FK_Subscription_LogoId] FOREIGN KEY ([LogoId]) REFERENCES [dbo].[MediaItem] ([Id])
);

