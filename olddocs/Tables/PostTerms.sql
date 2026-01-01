CREATE TABLE [dbo].[PostTerms] (
    [PostId] UNIQUEIDENTIFIER NOT NULL,
    [TermId] UNIQUEIDENTIFIER NOT NULL,
    [Order]  INT              DEFAULT ((0)) NOT NULL,
    [IsMain] BIT              DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_PostTerms] PRIMARY KEY CLUSTERED ([PostId] ASC, [TermId] ASC),
    CONSTRAINT [FK_PostTerms_PostId] FOREIGN KEY ([PostId]) REFERENCES [dbo].[Post] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_PostTerms_TermId] FOREIGN KEY ([TermId]) REFERENCES [dbo].[Term] ([Id]) ON DELETE CASCADE ON UPDATE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_PostTerms_TermId]
    ON [dbo].[PostTerms]([TermId] ASC);

