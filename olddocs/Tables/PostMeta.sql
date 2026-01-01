CREATE TABLE [dbo].[PostMeta] (
    [Id]     UNIQUEIDENTIFIER NOT NULL,
    [PostId] UNIQUEIDENTIFIER NOT NULL,
    [Key]    NVARCHAR (150)   NULL,
    [Value]  NVARCHAR (MAX)   NULL,
    [Icon]   VARCHAR (50)     NULL,
    [Order]  INT              CONSTRAINT [DF_PostMeta_Order] DEFAULT ((1)) NOT NULL,
    [Title]  NVARCHAR (256)   NULL,
    CONSTRAINT [PK_PostMeta] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (FILLFACTOR = 100),
    CONSTRAINT [FK_PostMeta_PostId] FOREIGN KEY ([PostId]) REFERENCES [dbo].[Post] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_PostMeta_PostId]
    ON [dbo].[PostMeta]([PostId] ASC)
    INCLUDE([Key], [Value], [Icon], [Order], [Title]);

