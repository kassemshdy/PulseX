CREATE TABLE [dbo].[Resources] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [Key]            NVARCHAR (440)   NOT NULL,
    [EnglishValue]   NVARCHAR (200)   NULL,
    [DisplayName]    NVARCHAR (200)   NULL,
    [Application]    INT              NULL,
    [Language]       NVARCHAR (10)    NOT NULL,
    [SubscriptionId] UNIQUEIDENTIFIER CONSTRAINT [DF_Resources_SubscriptionId] DEFAULT ('67B6364E-D75C-48BF-BC79-A850AC71885A') NOT NULL,
    [Value]          NVARCHAR (MAX)   NULL,
    CONSTRAINT [PK_LocalizableResource] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (FILLFACTOR = 100),
    CONSTRAINT [FK_Resources_Subscription] FOREIGN KEY ([SubscriptionId]) REFERENCES [dbo].[Subscription] ([Id])
);

