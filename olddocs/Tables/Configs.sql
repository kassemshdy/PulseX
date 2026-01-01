CREATE TABLE [dbo].[Configs] (
    [ConfigId]       INT              IDENTITY (1, 1) NOT NULL,
    [EnumKey]        INT              NOT NULL,
    [Name]           NVARCHAR (255)   NOT NULL,
    [LastModified]   DATETIME         CONSTRAINT [DF_Config_LastModified] DEFAULT (getutcdate()) NOT NULL,
    [JsonValue]      NVARCHAR (MAX)   NULL,
    [ClassName]      NVARCHAR (100)   DEFAULT (NULL) NULL,
    [IsPublic]       BIT              DEFAULT ((0)) NOT NULL,
    [SubscriptionId] UNIQUEIDENTIFIER CONSTRAINT [DF_Configs_SubscriptionId] DEFAULT ('67B6364E-D75C-48BF-BC79-A850AC71885A') NOT NULL,
    CONSTRAINT [PK_Config] PRIMARY KEY CLUSTERED ([ConfigId] ASC),
    CONSTRAINT [FK_Configs_Subscription] FOREIGN KEY ([SubscriptionId]) REFERENCES [dbo].[Subscription] ([Id])
);

