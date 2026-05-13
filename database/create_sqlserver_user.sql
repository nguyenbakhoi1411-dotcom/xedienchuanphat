USE master;
GO

IF NOT EXISTS (SELECT 1 FROM sys.sql_logins WHERE name = N'ev_user')
BEGIN
    CREATE LOGIN ev_user WITH PASSWORD = N'EvShowroom@123';
END
GO

USE ev_showroom;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'ev_user')
BEGIN
    CREATE USER ev_user FOR LOGIN ev_user;
END
GO

ALTER ROLE db_owner ADD MEMBER ev_user;
GO

