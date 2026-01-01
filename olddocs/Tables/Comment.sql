CREATE TABLE [dbo].[Comment] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [PublicId]       INT              IDENTITY (1, 1) NOT NULL,
    [UserId]         UNIQUEIDENTIFIER NOT NULL,
    [ParentId]       UNIQUEIDENTIFIER NULL,
    [Content]        NVARCHAR (MAX)   NOT NULL,
    [Status]         INT              CONSTRAINT [DF_Comment_Status] DEFAULT ((10)) NOT NULL,
    [CreationDate]   DATETIME         NOT NULL,
    [LastModified]   DATETIME         NULL,
    [DeletionDate]   DATETIME         NULL,
    [PostId]         UNIQUEIDENTIFIER NOT NULL,
    [SubscriptionId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [PK_Comment] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Comment_FrontUser] FOREIGN KEY ([UserId]) REFERENCES [dbo].[FrontUser] ([Id])
);

