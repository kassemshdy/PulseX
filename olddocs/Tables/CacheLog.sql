CREATE TABLE [dbo].[CacheLog] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [AppName]        VARCHAR (50)     NULL,
    [CreationDate]   DATETIME         NULL,
    [LastModified]   DATETIME         NULL,
    [SubscriptionId] UNIQUEIDENTIFIER NULL,
    [PublicId]       INT              IDENTITY (1, 1) NOT NULL,
    [CacheKey]       NVARCHAR (250)   NULL
);

