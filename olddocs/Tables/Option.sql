CREATE TABLE [dbo].[Option] (
    [Id]           UNIQUEIDENTIFIER NOT NULL,
    [Status]       INT              CONSTRAINT [DF_Option_Status] DEFAULT ((10)) NOT NULL,
    [CreationDate] DATETIME         NOT NULL,
    [QuestionId]   UNIQUEIDENTIFIER NOT NULL,
    [Title]        NVARCHAR (MAX)   NOT NULL,
    [Description]  NVARCHAR (MAX)   NULL,
    [Thumbnail]    NVARCHAR (MAX)   NULL,
    [Order]        INT              CONSTRAINT [DF_Option_Order] DEFAULT ((1)) NULL,
    [IsAnswer]     BIT              DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Option_Question] FOREIGN KEY ([QuestionId]) REFERENCES [dbo].[Question] ([Id])
);

