CREATE TABLE [dbo].[UserMedia] (
    [Id]               UNIQUEIDENTIFIER NOT NULL,
    [PublicId]         INT              IDENTITY (1, 1) NOT NULL,
    [CreationDate]     DATETIME         NOT NULL,
    [Status]           INT              NOT NULL,
    [LastModified]     DATETIME         NULL,
    [Path]             NVARCHAR (MAX)   NULL,
    [Type]             INT              NOT NULL,
    [UserSubmissionId] UNIQUEIDENTIFIER NULL,
    CONSTRAINT [PK_UserMedia] PRIMARY KEY CLUSTERED ([Id] ASC)
);

