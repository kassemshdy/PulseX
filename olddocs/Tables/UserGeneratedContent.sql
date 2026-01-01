CREATE TABLE [dbo].[UserGeneratedContent] (
    [Id]              UNIQUEIDENTIFIER NOT NULL,
    [Title]           NVARCHAR (256)   NULL,
    [Summary]         NVARCHAR (MAX)   NULL,
    [Type]            NVARCHAR (50)    NULL,
    [UserMediaId]     UNIQUEIDENTIFIER NULL,
    [UserFullName]    NVARCHAR (256)   NULL,
    [UserEmail]       NVARCHAR (256)   NULL,
    [UserMobile]      NVARCHAR (20)    NULL,
    [UserAge]         INT              NULL,
    [UserGender]      INT              NULL,
    [UserNationality] NVARCHAR (256)   NULL,
    [UserCountry]     NVARCHAR (256)   NULL,
    [SubscriptionId]  UNIQUEIDENTIFIER NOT NULL,
    [CreationDate]    DATETIME         NOT NULL,
    [LastModified]    DATETIME         NULL,
    [Status]          INT              NOT NULL,
    [StatusChangedBy] UNIQUEIDENTIFIER NULL,
    [Reason]          NVARCHAR (MAX)   NULL,
    [BrandName]       NVARCHAR (256)   NULL,
    [PublishedTo]     NVARCHAR (256)   NULL,
    CONSTRAINT [PK_UserGeneratedContent] PRIMARY KEY CLUSTERED ([Id] ASC)
);

