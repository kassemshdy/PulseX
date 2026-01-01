CREATE TABLE [dbo].[RolePermission] (
    [RoleId]     UNIQUEIDENTIFIER NOT NULL,
    [Id]         UNIQUEIDENTIFIER NOT NULL,
    [PublicId]   INT              IDENTITY (1, 1) NOT NULL,
    [Controller] NVARCHAR (150)   NULL,
    [Action]     NVARCHAR (MAX)   NULL,
    [Parameters] NVARCHAR (MAX)   NULL,
    [Allow]      BIT              DEFAULT ((1)) NOT NULL,
    CONSTRAINT [FK_RolePermission_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Roles] ([Id]) ON DELETE CASCADE
);

