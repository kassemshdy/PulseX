CREATE TABLE [dbo].[Glossary] (
    [Id]           UNIQUEIDENTIFIER NOT NULL,
    [ResourceId]   UNIQUEIDENTIFIER NOT NULL,
    [ResourceType] INT              NOT NULL,
    [Field]        NVARCHAR (150)   NOT NULL,
    [Language]     VARCHAR (4)      NOT NULL,
    [Value]        NVARCHAR (MAX)   NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_Glossary_ResourceId]
    ON [dbo].[Glossary]([ResourceId] ASC)
    INCLUDE([ResourceType], [Field], [Language], [Value]);

