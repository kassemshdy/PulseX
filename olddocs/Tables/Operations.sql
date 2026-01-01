CREATE TABLE [dbo].[Operations] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [Status]         INT              NOT NULL,
    [CurrentState]   NVARCHAR (MAX)   NULL,
    [Service]        NVARCHAR (100)   NOT NULL,
    [Action]         NVARCHAR (100)   NOT NULL,
    [PostId]         UNIQUEIDENTIFIER NULL,
    [MediaId]        UNIQUEIDENTIFIER NULL,
    [CreationDate]   DATETIME         NOT NULL,
    [StartTime]      DATETIME         NULL,
    [EndTime]        DATETIME         NULL,
    [Progress]       INT              NULL,
    [Parameters]     NVARCHAR (MAX)   NULL,
    [Result]         NVARCHAR (MAX)   NULL,
    [Messages]       NVARCHAR (MAX)   NULL,
    [SubscriptionId] UNIQUEIDENTIFIER NOT NULL,
    [Callback]       NVARCHAR (100)   NULL,
    [Info]           NVARCHAR (MAX)   NULL,
    CONSTRAINT [PK_Operations] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Operations_Subscription] FOREIGN KEY ([SubscriptionId]) REFERENCES [dbo].[Subscription] ([Id])
);

