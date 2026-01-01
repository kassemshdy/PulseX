CREATE TABLE [dbo].[Answer] (
    [Id]           UNIQUEIDENTIFIER NOT NULL,
    [Status]       INT              CONSTRAINT [DF_Answer_Status] DEFAULT ((10)) NOT NULL,
    [CreationDate] DATETIME         NOT NULL,
    [QuestionId]   UNIQUEIDENTIFIER NOT NULL,
    [OptionId]     UNIQUEIDENTIFIER NULL,
    [Value]        NVARCHAR (MAX)   NULL,
    [SessionId]    NVARCHAR (50)    NULL,
    [Batch]        NVARCHAR (256)   NULL,
    [UserId]       UNIQUEIDENTIFIER NULL,
    [SurveyId]     UNIQUEIDENTIFIER NOT NULL,
    [UserEmail]    NVARCHAR (256)   NULL,
    [UserName]     NVARCHAR (256)   NULL,
    CONSTRAINT [PK_Answers] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Answer_Question] FOREIGN KEY ([QuestionId]) REFERENCES [dbo].[Question] ([Id]),
    CONSTRAINT [FK_Answer_Survey] FOREIGN KEY ([SurveyId]) REFERENCES [dbo].[Survey] ([Id]),
    CONSTRAINT [FK_Answer_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[FrontUser] ([Id]),
    CONSTRAINT [FK_Option] FOREIGN KEY ([OptionId]) REFERENCES [dbo].[Option] ([Id])
);

