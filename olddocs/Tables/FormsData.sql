CREATE TABLE [dbo].[FormsData] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [Title]          NVARCHAR (500)   NULL,
    [CreationDate]   DATETIME         NOT NULL,
    [Data]           NVARCHAR (MAX)   NOT NULL,
    [Form]           NVARCHAR (100)   NOT NULL,
    [SentTo]         NVARCHAR (500)   NULL,
    [IpAddress]      NVARCHAR (50)    NULL,
    [Browser]        NVARCHAR (50)    NULL,
    [Referrer]       NVARCHAR (150)   NULL,
    [Message]        NVARCHAR (MAX)   NULL,
    [SubscriptionId] UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

