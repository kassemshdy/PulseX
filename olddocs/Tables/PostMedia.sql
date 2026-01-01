CREATE TABLE [dbo].[PostMedia] (
    [Id]          UNIQUEIDENTIFIER NOT NULL,
    [MediaItemId] UNIQUEIDENTIFIER NOT NULL,
    [PostId]      UNIQUEIDENTIFIER NOT NULL,
    [Order]       INT              NOT NULL,
    [Placement]   NVARCHAR (50)    NOT NULL,
    [PostCaption] NVARCHAR (256)   NULL,
    CONSTRAINT [PK_PostMedia] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_PostMedia_MediaItemId] FOREIGN KEY ([MediaItemId]) REFERENCES [dbo].[MediaItem] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_PostMedia_PostId] FOREIGN KEY ([PostId]) REFERENCES [dbo].[Post] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_PostMedia_PostId]
    ON [dbo].[PostMedia]([PostId] ASC);

