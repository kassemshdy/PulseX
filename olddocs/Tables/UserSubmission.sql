CREATE TABLE [dbo].[UserSubmission] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [PublicId]       INT              IDENTITY (1, 1) NOT NULL,
    [Title]          NVARCHAR (256)   NULL,
    [CreationDate]   DATETIME         NOT NULL,
    [Status]         INT              NOT NULL,
    [LastModified]   DATETIME         NULL,
    [UserId]         UNIQUEIDENTIFIER NULL,
    [ParentId]       UNIQUEIDENTIFIER NULL,
    [PostTypeId]     UNIQUEIDENTIFIER NULL,
    [PostId]         UNIQUEIDENTIFIER NULL,
    [Details]        NVARCHAR (MAX)   NOT NULL,
    [SubscriptionId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [PK_UserSubmission] PRIMARY KEY CLUSTERED ([Id] ASC)
);

