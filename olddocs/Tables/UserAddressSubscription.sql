CREATE TABLE [dbo].[UserAddressSubscription] (
    [Id]             UNIQUEIDENTIFIER NOT NULL,
    [FullName]       NVARCHAR (255)   NULL,
    [Street]         NVARCHAR (255)   NULL,
    [PhoneNumber]    NVARCHAR (255)   NULL,
    [UserId]         UNIQUEIDENTIFIER NOT NULL,
    [CreationDate]   DATETIME         NOT NULL,
    [Country]        NVARCHAR (255)   NULL,
    [SubscriptionId] UNIQUEIDENTIFIER NOT NULL,
    [DeletedByUser]  BIT              NULL,
    CONSTRAINT [PK_UserAddress] PRIMARY KEY CLUSTERED ([Id] ASC)
);

