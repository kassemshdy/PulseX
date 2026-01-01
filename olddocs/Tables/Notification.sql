CREATE TABLE [dbo].[Notification] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [Title]          NVARCHAR (1000)  NULL,
    [ScheduleDate]   DATETIME         NULL,
    [CreationDate]   DATETIME         NOT NULL,
    [Details]        NVARCHAR (1000)  NULL,
    [PostId]         UNIQUEIDENTIFIER NULL,
    [SubscriptionId] UNIQUEIDENTIFIER NOT NULL,
    [ForMobile]      BIT              NULL,
    [ForWeb]         BIT              NULL,
    [Status]         INT              NULL,
    [OperationId]    UNIQUEIDENTIFIER NULL,
    CONSTRAINT [PK_Notification] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Notification_Subscription] FOREIGN KEY ([SubscriptionId]) REFERENCES [dbo].[Subscription] ([Id])
);


GO
CREATE NONCLUSTERED INDEX [IX_Notification_Status_ScheduleDate]
    ON [dbo].[Notification]([Status] ASC, [ScheduleDate] ASC)
    INCLUDE([OperationId]);

