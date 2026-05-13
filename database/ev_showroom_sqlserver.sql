IF DB_ID(N'ev_showroom') IS NULL
BEGIN
    CREATE DATABASE ev_showroom;
END
GO

USE ev_showroom;
GO

IF OBJECT_ID(N'dbo.sales_order_items', N'U') IS NOT NULL DROP TABLE dbo.sales_order_items;
IF OBJECT_ID(N'dbo.sales_orders', N'U') IS NOT NULL DROP TABLE dbo.sales_orders;
IF OBJECT_ID(N'dbo.service_tickets', N'U') IS NOT NULL DROP TABLE dbo.service_tickets;
IF OBJECT_ID(N'dbo.stocktake_entries', N'U') IS NOT NULL DROP TABLE dbo.stocktake_entries;
IF OBJECT_ID(N'dbo.inventory_movements', N'U') IS NOT NULL DROP TABLE dbo.inventory_movements;
IF OBJECT_ID(N'dbo.purchase_order_items', N'U') IS NOT NULL DROP TABLE dbo.purchase_order_items;
IF OBJECT_ID(N'dbo.purchase_orders', N'U') IS NOT NULL DROP TABLE dbo.purchase_orders;
IF OBJECT_ID(N'dbo.accounting_entries', N'U') IS NOT NULL DROP TABLE dbo.accounting_entries;
IF OBJECT_ID(N'dbo.accounting_accounts', N'U') IS NOT NULL DROP TABLE dbo.accounting_accounts;
IF OBJECT_ID(N'dbo.activity_logs', N'U') IS NOT NULL DROP TABLE dbo.activity_logs;
IF OBJECT_ID(N'dbo.user_module_permissions', N'U') IS NOT NULL DROP TABLE dbo.user_module_permissions;
IF OBJECT_ID(N'dbo.user_accounts', N'U') IS NOT NULL DROP TABLE dbo.user_accounts;
IF OBJECT_ID(N'dbo.vouchers', N'U') IS NOT NULL DROP TABLE dbo.vouchers;
IF OBJECT_ID(N'dbo.channel_conversations', N'U') IS NOT NULL DROP TABLE dbo.channel_conversations;
IF OBJECT_ID(N'dbo.inventory_items', N'U') IS NOT NULL DROP TABLE dbo.inventory_items;
IF OBJECT_ID(N'dbo.suppliers', N'U') IS NOT NULL DROP TABLE dbo.suppliers;
IF OBJECT_ID(N'dbo.customers', N'U') IS NOT NULL DROP TABLE dbo.customers;
IF OBJECT_ID(N'dbo.products', N'U') IS NOT NULL DROP TABLE dbo.products;
IF OBJECT_ID(N'dbo.branches', N'U') IS NOT NULL DROP TABLE dbo.branches;
GO

CREATE TABLE dbo.branches (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    address NVARCHAR(255) NOT NULL,
    phone NVARCHAR(30) NULL,
    latitude DECIMAL(10, 7) NULL,
    longitude DECIMAL(10, 7) NULL,
    active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

CREATE TABLE dbo.products (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    brand NVARCHAR(100) NOT NULL,
    model NVARCHAR(100) NULL,
    color NVARCHAR(80) NULL,
    category NVARCHAR(60) NOT NULL,
    battery NVARCHAR(100) NULL,
    warranty_months INT NOT NULL DEFAULT 36,
    price DECIMAL(15, 2) NOT NULL,
    image_url NVARCHAR(500) NULL,
    qr_code NVARCHAR(150) NULL,
    specifications NVARCHAR(MAX) NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

CREATE TABLE dbo.customers (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(150) NOT NULL,
    phone NVARCHAR(30) NOT NULL,
    email NVARCHAR(150) NULL,
    address NVARCHAR(255) NULL,
    birthday DATE NULL,
    loyalty_points INT NOT NULL DEFAULT 0,
    tier NVARCHAR(30) NOT NULL DEFAULT N'NEW',
    source NVARCHAR(50) NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

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
GO

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
GO

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
GO

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
GO

CREATE TABLE dbo.accounting_accounts (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    account_code NVARCHAR(40) NOT NULL UNIQUE,
    account_name NVARCHAR(150) NOT NULL,
    account_type NVARCHAR(60) NOT NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
    active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

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
GO

CREATE TABLE dbo.inventory_items (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    serial_number NVARCHAR(120) NOT NULL UNIQUE,
    imei NVARCHAR(120) NULL UNIQUE,
    vehicle_code NVARCHAR(120) NULL UNIQUE,
    status NVARCHAR(30) NOT NULL DEFAULT N'IN_STOCK',
    cost_price DECIMAL(15, 2) NULL,
    received_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_inventory_branch FOREIGN KEY (branch_id) REFERENCES dbo.branches(id),
    CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES dbo.products(id)
);
GO

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
GO

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
GO

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
GO

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
GO

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
GO

CREATE TABLE dbo.sales_orders (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    order_code NVARCHAR(50) NOT NULL UNIQUE,
    branch_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    discount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    tax DECIMAL(15, 2) NOT NULL DEFAULT 0,
    deposit_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    total DECIMAL(15, 2) NOT NULL,
    voucher_code NVARCHAR(60) NULL,
    payment_method NVARCHAR(30) NOT NULL,
    status NVARCHAR(30) NOT NULL DEFAULT N'PAID',
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_order_branch FOREIGN KEY (branch_id) REFERENCES dbo.branches(id),
    CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES dbo.customers(id)
);
GO

CREATE TABLE dbo.sales_order_items (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    sales_order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    inventory_item_id BIGINT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(15, 2) NOT NULL,
    line_total DECIMAL(15, 2) NOT NULL,
    CONSTRAINT fk_order_item_order FOREIGN KEY (sales_order_id) REFERENCES dbo.sales_orders(id),
    CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES dbo.products(id),
    CONSTRAINT fk_order_item_inventory FOREIGN KEY (inventory_item_id) REFERENCES dbo.inventory_items(id)
);
GO

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
GO

CREATE TABLE dbo.channel_conversations (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    channel NVARCHAR(30) NOT NULL,
    external_id NVARCHAR(150) NULL,
    customer_name NVARCHAR(150) NULL,
    customer_phone NVARCHAR(30) NULL,
    message NVARCHAR(MAX) NOT NULL,
    assigned_to NVARCHAR(150) NULL,
    status NVARCHAR(30) NOT NULL DEFAULT N'NEW',
    lead_tag NVARCHAR(80) NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

INSERT INTO dbo.branches (name, address, phone, latitude, longitude)
VALUES
    (N'CS1 - Chuan Phat Le Viet Thuat', N'So 389 Le Viet Thuat, Vinh Loc, Nghe An', N'0832.032.555', NULL, NULL),
    (N'CS2 - Chuan Phat Nguyen Trai', N'So 7 Nguyen Trai, P. Vinh Hung, Nghe An', N'0832.058.555', NULL, NULL),
    (N'CS3 - Chuan Phat Nam Dan', N'So 238, QL46, TT. Nam Dan, Nghe An', N'0832.028.555', NULL, NULL),
    (N'CS4 - Chuan Phat Nguyen Du', N'So 116 Nguyen Du, P. Truong Vinh, Nghe An', N'0815.016.555', NULL, NULL),
    (N'CS5 - Chuan Phat Le Loi', N'So 60 Le Loi, P. Thanh Vinh, Nghe An', N'0815.018.555', NULL, NULL),
    (N'Xuong dich vu VinFast Chuan Phat', N'So 389 Le Viet Thuat, Vinh Loc, Nghe An', N'0912.186.586', NULL, NULL);
GO

INSERT INTO dbo.user_accounts (username, password_hash, display_name, phone, role, branch_id)
VALUES
    (N'admin', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', N'Quan tri he thong', N'0912.186.586', N'ADMIN', NULL),
    (N'ketoan', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', N'Ke toan Chuẩn Phat', N'0832.032.555', N'ACCOUNTANT', 1),
    (N'thungan', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', N'Thu ngan CS1', N'0832.032.555', N'CASHIER', 1);
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
CROSS JOIN modules;
GO

INSERT INTO dbo.accounting_accounts (account_code, account_name, account_type, balance)
VALUES
    (N'111', N'Tien mat', N'ASSET', 120000000),
    (N'112', N'Tien gui ngan hang', N'ASSET', 350000000),
    (N'131', N'Phai thu khach hang', N'ASSET', 30000000),
    (N'331', N'Phai tra nha cung cap', N'LIABILITY', 18000000),
    (N'511', N'Doanh thu ban hang', N'REVENUE', 0),
    (N'632', N'Gia von hang ban', N'EXPENSE', 0),
    (N'3331', N'Thue VAT phai nop', N'LIABILITY', 0);
GO

INSERT INTO dbo.products (name, brand, model, color, category, battery, warranty_months, price, qr_code, specifications)
VALUES
    (N'Xe may dien Evo200', N'VinFast', N'Evo200', N'Trang cam', N'E_MOTORBIKE', N'LFP 3.5 kWh', 36, 22000000, N'CP-EVO200', N'Toc do toi da 70 km/h, tam hoat dong khoang 200 km'),
    (N'Xe dap dien Vento', N'Yadea', N'Vento', N'Xanh', N'E_BICYCLE', N'Lithium', 24, 12500000, N'CP-VENTO', N'Thiet ke nho gon, phu hop di chuyen hang ngay');
GO

INSERT INTO dbo.customers (full_name, phone, email, tier, source, birthday, loyalty_points)
VALUES
    (N'Nguyen Van A', N'0912345678', N'a@example.com', N'NEW', N'Facebook', '1992-05-20', 120),
    (N'Tran Thi B', N'0987654321', N'b@example.com', N'VIP', N'Zalo OA', '1989-11-02', 950);
GO

INSERT INTO dbo.suppliers (name, phone, email, address, tax_code, contact_person, debt_balance)
VALUES
    (N'VinFast', N'1900232389', N'ncc@vinfast.vn', N'Ha Noi', N'VINFAST', N'Phong kinh doanh', 18000000),
    (N'Yadea Viet Nam', N'18006923', N'ncc@yadea.vn', N'Viet Nam', N'YADEA', N'Phong phan phoi', 0);
GO

INSERT INTO dbo.inventory_items (branch_id, product_id, serial_number, imei, vehicle_code, status, cost_price)
VALUES
    (1, 1, N'SN-EVO-0001', N'IMEI-EVO-0001', N'CP001', N'IN_STOCK', 18000000),
    (2, 2, N'SN-VEN-0001', N'IMEI-VEN-0001', N'CP002', N'IN_STOCK', 9000000),
    (3, 1, N'SN-EVO-0002', N'IMEI-EVO-0002', N'CP003', N'IN_STOCK', 18000000);
GO

INSERT INTO dbo.inventory_movements (type, inventory_item_id, product_id, to_branch_id, quantity, reference_code, unit_cost, note)
VALUES
    (N'IMPORT', 1, 1, 1, 1, N'SN-EVO-0001', 18000000, N'Nhap kho dau ky'),
    (N'IMPORT', 2, 2, 2, 1, N'SN-VEN-0001', 9000000, N'Nhap kho dau ky'),
    (N'IMPORT', 3, 1, 3, 1, N'SN-EVO-0002', 18000000, N'Nhap kho dau ky');
GO

INSERT INTO dbo.accounting_entries (voucher_code, entry_date, type, category, branch_id, partner_name, description, amount, payment_method, status)
VALUES
    (N'KT-0001', CAST(GETDATE() AS DATE), N'INCOME', N'Doanh thu ban xe', 1, N'Nguyen Van A', N'Thu tien ban xe may dien', 22000000, N'CASH', N'POSTED'),
    (N'KT-0002', CAST(GETDATE() AS DATE), N'EXPENSE', N'Chi phi van hanh', 1, N'Dien luc Nghe An', N'Thanh toan tien dien showroom', 2500000, N'BANK_TRANSFER', N'POSTED'),
    (N'KT-0003', CAST(GETDATE() AS DATE), N'PAYABLE', N'Cong no nha cung cap', 2, N'VinFast', N'Cong no nhap xe trong thang', 18000000, N'BANK_TRANSFER', N'PARTIAL'),
    (N'KT-0004', CAST(GETDATE() AS DATE), N'RECEIVABLE', N'Khach tra gop', 3, N'Tran Thi B', N'Khoan phai thu hop dong tra gop', 12500000, N'INSTALLMENT', N'PARTIAL');
GO

INSERT INTO dbo.purchase_orders (purchase_code, supplier_id, branch_id, order_date, due_date, subtotal, discount, tax, total, paid_amount, status)
VALUES
    (N'PN-0001', 1, 1, CAST(GETDATE() AS DATE), DATEADD(day, 15, CAST(GETDATE() AS DATE)), 36000000, 0, 0, 36000000, 18000000, N'PARTIAL');
GO

INSERT INTO dbo.purchase_order_items (purchase_order_id, product_id, quantity, unit_cost, line_total)
VALUES
    (1, 1, 2, 18000000, 36000000);
GO

INSERT INTO dbo.vouchers (code, name, type, value, min_order_value, start_date, end_date, usage_limit, used_count)
VALUES
    (N'CP500', N'Giam 500k khi mua xe dien', N'FIXED_AMOUNT', 500000, 10000000, CAST(GETDATE() AS DATE), DATEADD(month, 1, CAST(GETDATE() AS DATE)), 200, 0),
    (N'VIP3', N'Khach VIP giam 3%', N'PERCENTAGE', 3, 15000000, CAST(GETDATE() AS DATE), DATEADD(month, 3, CAST(GETDATE() AS DATE)), NULL, 0);
GO

INSERT INTO dbo.stocktake_entries (branch_id, product_id, system_quantity, actual_quantity, difference_quantity, status, note)
VALUES
    (1, 1, 1, 1, 0, N'APPROVED', N'Kiem ke dau ky');
GO

INSERT INTO dbo.service_tickets (ticket_code, branch_id, customer_id, inventory_item_id, status, issue_description, diagnosis, replacement_parts, service_cost, appointment_date, warranty_until)
VALUES
    (N'BH-0001', 1, 1, 1, N'DIAGNOSING', N'Kiem tra pin va phanh', N'Dang kiem tra', N'Chua thay the', 0, DATEADD(day, 2, CAST(GETDATE() AS DATE)), DATEADD(month, 36, CAST(GETDATE() AS DATE)));
GO

INSERT INTO dbo.channel_conversations (channel, customer_name, customer_phone, message, lead_tag, status)
VALUES
    (N'FACEBOOK', N'Le Minh C', N'0901111222', N'Khach hoi gia xe may dien va tra gop.', N'hoi tra gop', N'NEW'),
    (N'ZALO_OA', N'Pham Anh D', N'0903333444', N'Khach can nhac lich bao duong.', N'bao duong', N'NEW'),
    (N'TIKTOK', N'Hoang E', N'0905555666', N'Khach den tu livestream TikTok.', N'khach nong', N'NEW');
GO

INSERT INTO dbo.activity_logs (actor_name, module_name, action_name, branch_id, description)
VALUES
    (N'system', N'SYSTEM', N'INIT', NULL, N'Tao du lieu mau offline cho ChuanPhat'),
    (N'Quan tri he thong', N'AUTH', N'LOGIN', NULL, N'Dang nhap he thong'),
    (N'Ke toan Chuan Phat', N'AUTH', N'LOGIN', 1, N'Dang nhap he thong'),
    (N'Ke toan Chuan Phat', N'AUTH', N'LOGOUT', 1, N'Dang xuat he thong');
GO
