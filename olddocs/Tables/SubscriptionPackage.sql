CREATE TABLE [dbo].[SubscriptionPackage] (
    [Id]               UNIQUEIDENTIFIER NOT NULL,
    [Title]            NVARCHAR (100)   NOT NULL,
    [Code]             NVARCHAR (100)   NOT NULL,
    [Description]      NVARCHAR (MAX)   NULL,
    [CreationDate]     DATETIME         NOT NULL,
    [Status]           INT              NOT NULL,
    [Price]            FLOAT (53)       NULL,
    [Discount]         FLOAT (53)       NULL,
    [SubscriptionId]   UNIQUEIDENTIFIER NOT NULL,
    [Options]          NVARCHAR (MAX)   NULL,
    [AndroidPackageId] NVARCHAR (255)   NULL,
    [IOSPackageId]     NVARCHAR (255)   NULL,
    [PublicId]         INT              IDENTITY (1, 1) NOT NULL,
    [DaysLength]       INT              NULL,
    [Order]            INT              NULL,
    [Photo]            NVARCHAR (255)   NULL,
    CONSTRAINT [PK_SubscriptionPackage] PRIMARY KEY CLUSTERED ([Id] ASC)
);

