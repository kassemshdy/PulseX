CREATE TABLE [dbo].[UrlMapping] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [CreationDate]   DATETIME         NOT NULL,
    [Status]         INT              NOT NULL,
    [SubscriptionId] UNIQUEIDENTIFIER NOT NULL,
    [Url]            NVARCHAR (500)   NOT NULL,
    [RedirectUrl]    NVARCHAR (500)   NOT NULL,
    CONSTRAINT [PK_UrlMapping_Id] PRIMARY KEY CLUSTERED ([Id] ASC)
);

