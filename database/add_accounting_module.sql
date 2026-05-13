USE ev_showroom;
GO

IF OBJECT_ID(N'dbo.accounting_entries', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.accounting_entries (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        voucher_code NVARCHAR(50) NOT NULL UNIQUE,
        entry_date DATE NOT NULL,
        type NVARCHAR(30) NOT NULL,
        category NVARCHAR(120) NULL,
        branch_id BIGINT NULL,
        partner_name NVARCHAR(150) NULL,
        description NVARCHAR(MAX) NULL,
        amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
        payment_method NVARCHAR(30) NOT NULL,
        status NVARCHAR(30) NOT NULL DEFAULT N'POSTED',
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT fk_accounting_branch FOREIGN KEY (branch_id) REFERENCES dbo.branches(id)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.accounting_entries WHERE voucher_code = N'KT-0001')
BEGIN
    INSERT INTO dbo.accounting_entries (voucher_code, entry_date, type, category, branch_id, partner_name, description, amount, payment_method, status)
    VALUES
        (N'KT-0001', CAST(GETDATE() AS DATE), N'INCOME', N'Doanh thu ban xe', 1, N'Nguyen Van A', N'Thu tien ban xe may dien', 22000000, N'CASH', N'POSTED'),
        (N'KT-0002', CAST(GETDATE() AS DATE), N'EXPENSE', N'Chi phi van hanh', 1, N'Dien luc Nghe An', N'Thanh toan tien dien showroom', 2500000, N'BANK_TRANSFER', N'POSTED'),
        (N'KT-0003', CAST(GETDATE() AS DATE), N'PAYABLE', N'Cong no nha cung cap', 2, N'VinFast', N'Cong no nhap xe trong thang', 18000000, N'BANK_TRANSFER', N'PARTIAL'),
        (N'KT-0004', CAST(GETDATE() AS DATE), N'RECEIVABLE', N'Khach tra gop', 3, N'Tran Thi B', N'Khoan phai thu hop dong tra gop', 12500000, N'INSTALLMENT', N'PARTIAL');
END
GO

