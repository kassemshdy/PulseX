CREATE TABLE [dbo].[Audit] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [UserId]         UNIQUEIDENTIFIER NULL,
    [Title]          NVARCHAR (MAX)   NOT NULL,
    [ResourceId]     UNIQUEIDENTIFIER NULL,
    [CreationDate]   DATETIME         CONSTRAINT [DF_Audit_CreationDate] DEFAULT (sysdatetime()) NOT NULL,
    [Controller]     NVARCHAR (50)    NULL,
    [Action]         NVARCHAR (50)    NOT NULL,
    [PreviewUrl]     NVARCHAR (256)   NULL,
    [PublicUrl]      NVARCHAR (256)   NULL,
    [Browser]        NVARCHAR (50)    NULL,
    [IpAddress]      NVARCHAR (50)    NULL,
    [Model]          NVARCHAR (MAX)   NULL,
    [SubscriptionId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [PK_Audit] PRIMARY KEY CLUSTERED ([Id] ASC)
);

