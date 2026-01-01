CREATE TABLE [dbo].[PostRelatives] (
    [Id]              UNIQUEIDENTIFIER NOT NULL,
    [PostId]          UNIQUEIDENTIFIER NOT NULL,
    [RelativeId]      UNIQUEIDENTIFIER NOT NULL,
    [Relation]        NVARCHAR (100)   NOT NULL,
    [RelationDisplay] NVARCHAR (265)   NOT NULL,
    [Order]           INT              DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_PostRelatives] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_PostRelatives_PostId] FOREIGN KEY ([PostId]) REFERENCES [dbo].[Post] ([Id]),
    CONSTRAINT [FK_PostRelatives_RelativeId] FOREIGN KEY ([RelativeId]) REFERENCES [dbo].[Post] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_PostRelatives_PostId]
    ON [dbo].[PostRelatives]([PostId] ASC)
    INCLUDE([RelativeId]);


GO
CREATE NONCLUSTERED INDEX [IX_PostRelatives_RelativeId_Relation]
    ON [dbo].[PostRelatives]([RelativeId] ASC, [Relation] ASC)
    INCLUDE([PostId], [Order]);


GO
CREATE NONCLUSTERED INDEX [IX_PostRelatives_RelativeId]
    ON [dbo].[PostRelatives]([RelativeId] ASC)
    INCLUDE([PostId]);

