USE ev_showroom;
GO

IF COL_LENGTH('dbo.products', 'color') IS NULL ALTER TABLE dbo.products ADD color NVARCHAR(80) NULL;
IF COL_LENGTH('dbo.products', 'warranty_months') IS NULL ALTER TABLE dbo.products ADD warranty_months INT NOT NULL CONSTRAINT df_products_warranty_months DEFAULT 36;
IF COL_LENGTH('dbo.products', 'qr_code') IS NULL ALTER TABLE dbo.products ADD qr_code NVARCHAR(150) NULL;
IF COL_LENGTH('dbo.customers', 'birthday') IS NULL ALTER TABLE dbo.customers ADD birthday DATE NULL;
IF COL_LENGTH('dbo.customers', 'loyalty_points') IS NULL ALTER TABLE dbo.customers ADD loyalty_points INT NOT NULL CONSTRAINT df_customers_loyalty_points DEFAULT 0;
IF COL_LENGTH('dbo.sales_orders', 'deposit_amount') IS NULL ALTER TABLE dbo.sales_orders ADD deposit_amount DECIMAL(15, 2) NOT NULL CONSTRAINT df_sales_orders_deposit_amount DEFAULT 0;
IF COL_LENGTH('dbo.sales_orders', 'voucher_code') IS NULL ALTER TABLE dbo.sales_orders ADD voucher_code NVARCHAR(60) NULL;
GO

IF OBJECT_ID(N'dbo.accounting_accounts', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.accounting_accounts (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        account_code NVARCHAR(40) NOT NULL UNIQUE,
        account_name NVARCHAR(150) NOT NULL,
        account_type NVARCHAR(60) NOT NULL,
        balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
        active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
    );
END
GO

IF OBJECT_ID(N'dbo.user_accounts', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.user_accounts (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(80) NOT NULL UNIQUE,
        password_hash NVARCHAR(128) NOT NULL,
        display_name NVARCHAR(150) NOT NULL,
        phone NVARCHAR(30) NULL,
        role NVARCHAR(40) NOT NULL,
        branch_id BIGINT NULL,
        active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        last_login_at DATETIME2 NULL,
        CONSTRAINT fk_user_branch FOREIGN KEY (branch_id) REFERENCES dbo.branches(id)
    );
END
GO

IF OBJECT_ID(N'dbo.activity_logs', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.activity_logs (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        actor_name NVARCHAR(150) NULL,
        module_name NVARCHAR(80) NULL,
        action_name NVARCHAR(80) NULL,
        branch_id BIGINT NULL,
        description NVARCHAR(MAX) NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT fk_activity_branch FOREIGN KEY (branch_id) REFERENCES dbo.branches(id)
    );
END
GO

IF OBJECT_ID(N'dbo.user_module_permissions', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.user_module_permissions (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        user_id BIGINT NOT NULL,
        module_key NVARCHAR(80) NOT NULL,
        module_name NVARCHAR(150) NOT NULL,
        can_access BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT fk_user_permission_user FOREIGN KEY (user_id) REFERENCES dbo.user_accounts(id),
        CONSTRAINT uq_user_module_permission UNIQUE (user_id, module_key)
    );
END
GO

IF OBJECT_ID(N'dbo.suppliers', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.suppliers (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(150) NOT NULL,
        phone NVARCHAR(30) NULL,
        email NVARCHAR(150) NULL,
        address NVARCHAR(255) NULL,
        tax_code NVARCHAR(60) NULL,
        contact_person NVARCHAR(150) NULL,
        debt_balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
        active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
    );
END
GO

IF OBJECT_ID(N'dbo.purchase_orders', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.purchase_orders (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        purchase_code NVARCHAR(50) NOT NULL UNIQUE,
        supplier_id BIGINT NOT NULL,
        branch_id BIGINT NOT NULL,
        order_date DATE NOT NULL,
        due_date DATE NULL,
        subtotal DECIMAL(15, 2) NOT NULL DEFAULT 0,
        discount DECIMAL(15, 2) NOT NULL DEFAULT 0,
        tax DECIMAL(15, 2) NOT NULL DEFAULT 0,
        total DECIMAL(15, 2) NOT NULL DEFAULT 0,
        paid_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
        status NVARCHAR(30) NOT NULL DEFAULT N'ORDERED',
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT fk_purchase_supplier FOREIGN KEY (supplier_id) REFERENCES dbo.suppliers(id),
        CONSTRAINT fk_purchase_branch FOREIGN KEY (branch_id) REFERENCES dbo.branches(id)
    );
END
GO

IF OBJECT_ID(N'dbo.purchase_order_items', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.purchase_order_items (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        purchase_order_id BIGINT NOT NULL,
        product_id BIGINT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        unit_cost DECIMAL(15, 2) NOT NULL DEFAULT 0,
        line_total DECIMAL(15, 2) NOT NULL DEFAULT 0,
        CONSTRAINT fk_purchase_item_order FOREIGN KEY (purchase_order_id) REFERENCES dbo.purchase_orders(id),
        CONSTRAINT fk_purchase_item_product FOREIGN KEY (product_id) REFERENCES dbo.products(id)
    );
END
GO

IF OBJECT_ID(N'dbo.inventory_movements', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.inventory_movements (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        type NVARCHAR(40) NOT NULL,
        inventory_item_id BIGINT NULL,
        product_id BIGINT NULL,
        from_branch_id BIGINT NULL,
        to_branch_id BIGINT NULL,
        quantity INT NOT NULL DEFAULT 1,
        reference_code NVARCHAR(80) NULL,
        unit_cost DECIMAL(15, 2) NOT NULL DEFAULT 0,
        note NVARCHAR(MAX) NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT fk_move_inventory FOREIGN KEY (inventory_item_id) REFERENCES dbo.inventory_items(id),
        CONSTRAINT fk_move_product FOREIGN KEY (product_id) REFERENCES dbo.products(id),
        CONSTRAINT fk_move_from_branch FOREIGN KEY (from_branch_id) REFERENCES dbo.branches(id),
        CONSTRAINT fk_move_to_branch FOREIGN KEY (to_branch_id) REFERENCES dbo.branches(id)
    );
END
GO

IF OBJECT_ID(N'dbo.stocktake_entries', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.stocktake_entries (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        branch_id BIGINT NOT NULL,
        product_id BIGINT NOT NULL,
        system_quantity INT NOT NULL DEFAULT 0,
        actual_quantity INT NOT NULL DEFAULT 0,
        difference_quantity INT NOT NULL DEFAULT 0,
        status NVARCHAR(30) NOT NULL DEFAULT N'DRAFT',
        note NVARCHAR(MAX) NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT fk_stocktake_branch FOREIGN KEY (branch_id) REFERENCES dbo.branches(id),
        CONSTRAINT fk_stocktake_product FOREIGN KEY (product_id) REFERENCES dbo.products(id)
    );
END
GO

IF OBJECT_ID(N'dbo.service_tickets', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.service_tickets (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        ticket_code NVARCHAR(50) NOT NULL UNIQUE,
        branch_id BIGINT NOT NULL,
        customer_id BIGINT NULL,
        inventory_item_id BIGINT NULL,
        status NVARCHAR(40) NOT NULL DEFAULT N'RECEIVED',
        issue_description NVARCHAR(MAX) NULL,
        diagnosis NVARCHAR(MAX) NULL,
        replacement_parts NVARCHAR(MAX) NULL,
        service_cost DECIMAL(15, 2) NOT NULL DEFAULT 0,
        appointment_date DATE NULL,
        warranty_until DATE NULL,
        completed_at DATETIME2 NULL,
        notification_sent BIT NOT NULL DEFAULT 0,
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT fk_service_branch FOREIGN KEY (branch_id) REFERENCES dbo.branches(id),
        CONSTRAINT fk_service_customer FOREIGN KEY (customer_id) REFERENCES dbo.customers(id),
        CONSTRAINT fk_service_inventory FOREIGN KEY (inventory_item_id) REFERENCES dbo.inventory_items(id)
    );
END
GO

IF OBJECT_ID(N'dbo.vouchers', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.vouchers (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        code NVARCHAR(60) NOT NULL UNIQUE,
        name NVARCHAR(150) NOT NULL,
        type NVARCHAR(30) NOT NULL,
        value DECIMAL(15, 2) NOT NULL DEFAULT 0,
        min_order_value DECIMAL(15, 2) NOT NULL DEFAULT 0,
        start_date DATE NOT NULL,
        end_date DATE NULL,
        usage_limit INT NULL,
        used_count INT NOT NULL DEFAULT 0,
        active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.user_accounts WHERE username = N'admin')
BEGIN
    INSERT INTO dbo.user_accounts (username, password_hash, display_name, phone, role, branch_id)
    VALUES (N'admin', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', N'Quan tri he thong', N'0912.186.586', N'ADMIN', NULL);
END
GO

WITH modules(module_key, module_name) AS (
    SELECT * FROM (VALUES
        (N'dashboard', N'Tong quan'),
        (N'pos', N'Ban hang / POS'),
        (N'accounting', N'Ke toan'),
        (N'users', N'Tai khoan'),
        (N'login-history', N'Lich su dang nhap'),
        (N'branches', N'Chi nhanh'),
        (N'products', N'San pham'),
        (N'inventory', N'Kho xe'),
        (N'purchases', N'Nhap hang'),
        (N'suppliers', N'Nha cung cap'),
        (N'customers', N'Khach hang'),
        (N'service', N'Bao hanh'),
        (N'marketing', N'Marketing'),
        (N'channels', N'Kenh ban hang'),
        (N'reports', N'Bao cao'),
        (N'automation', N'AI & tich hop')
    ) AS module_data(module_key, module_name)
)
INSERT INTO dbo.user_module_permissions (user_id, module_key, module_name, can_access)
SELECT
    users.id,
    modules.module_key,
    modules.module_name,
    CASE
        WHEN users.role = N'ADMIN' THEN 1
        WHEN users.role = N'ACCOUNTANT' AND modules.module_key IN (N'dashboard', N'accounting', N'customers', N'suppliers', N'reports', N'login-history') THEN 1
        WHEN users.role = N'CASHIER' AND modules.module_key IN (N'dashboard', N'pos', N'customers', N'products', N'inventory', N'reports') THEN 1
        WHEN users.role = N'BRANCH_MANAGER' AND modules.module_key IN (N'dashboard', N'pos', N'branches', N'products', N'inventory', N'purchases', N'suppliers', N'customers', N'service', N'marketing', N'channels', N'reports') THEN 1
        WHEN users.role = N'SERVICE' AND modules.module_key IN (N'dashboard', N'products', N'inventory', N'customers', N'service') THEN 1
        WHEN users.role = N'SALES' AND modules.module_key IN (N'dashboard', N'pos', N'products', N'inventory', N'customers', N'marketing', N'channels') THEN 1
        ELSE 0
    END
FROM dbo.user_accounts users
CROSS JOIN modules
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.user_module_permissions existing
    WHERE existing.user_id = users.id
      AND existing.module_key = modules.module_key
);
GO

IF NOT EXISTS (SELECT 1 FROM dbo.accounting_accounts WHERE account_code = N'111')
BEGIN
    INSERT INTO dbo.accounting_accounts (account_code, account_name, account_type, balance)
    VALUES
        (N'111', N'Tien mat', N'ASSET', 0),
        (N'112', N'Tien gui ngan hang', N'ASSET', 0),
        (N'131', N'Phai thu khach hang', N'ASSET', 0),
        (N'331', N'Phai tra nha cung cap', N'LIABILITY', 0),
        (N'511', N'Doanh thu ban hang', N'REVENUE', 0),
        (N'632', N'Gia von hang ban', N'EXPENSE', 0);
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.activity_logs WHERE module_name = N'AUTH')
BEGIN
    INSERT INTO dbo.activity_logs (actor_name, module_name, action_name, branch_id, description)
    VALUES
        (N'Quan tri he thong', N'AUTH', N'LOGIN', NULL, N'Dang nhap he thong'),
        (N'Ke toan Chuan Phat', N'AUTH', N'LOGIN', 1, N'Dang nhap he thong'),
        (N'Ke toan Chuan Phat', N'AUTH', N'LOGOUT', 1, N'Dang xuat he thong');
END
GO
