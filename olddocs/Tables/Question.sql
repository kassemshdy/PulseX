CREATE TABLE [dbo].[Question] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [PublicId]       INT              IDENTITY (1, 1) NOT NULL,
    [Status]         INT              CONSTRAINT [DF_Question_Status] DEFAULT ((10)) NOT NULL,
    [CreationDate]   DATETIME         NOT NULL,
    [LastModified]   DATETIME         NULL,
    [Title]          NVARCHAR (MAX)   NOT NULL,
    [Description]    NVARCHAR (MAX)   NULL,
    [Type]           INT              CONSTRAINT [DF_Question_Type] DEFAULT ((10)) NULL,
    [Order]          INT              CONSTRAINT [DF_Question_Order] DEFAULT ((1)) NULL,
    [SurveyId]       UNIQUEIDENTIFIER NOT NULL,
    [SubscriptionId] UNIQUEIDENTIFIER NOT NULL,
    [Code]           NVARCHAR (100)   NULL,
    [Required]       BIT              DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_Question] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Question_Subscription] FOREIGN KEY ([SubscriptionId]) REFERENCES [dbo].[Subscription] ([Id]),
    CONSTRAINT [FK_Question_Survey] FOREIGN KEY ([SurveyId]) REFERENCES [dbo].[Survey] ([Id])
);

