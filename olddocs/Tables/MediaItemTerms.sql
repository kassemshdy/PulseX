CREATE TABLE [dbo].[MediaItemTerms] (
    [MediaItemId] UNIQUEIDENTIFIER NOT NULL,
    [TermId]      UNIQUEIDENTIFIER NOT NULL,
    [Order]       INT              DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_MediaItemTerms] PRIMARY KEY CLUSTERED ([MediaItemId] ASC, [TermId] ASC),
    CONSTRAINT [FK_MediaItemTerms_MediaItemId] FOREIGN KEY ([MediaItemId]) REFERENCES [dbo].[MediaItem] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_MediaItemTerms_TermId] FOREIGN KEY ([TermId]) REFERENCES [dbo].[Term] ([Id]) ON DELETE CASCADE
);

