const API_BASE = location.protocol === "file:" ? "http://localhost:9998/api" : "/api";

const MODULE_CATALOG = [
    {key: "dashboard", name: "Phân hệ / Tổng quan"},
    {key: "pos", name: "Bán hàng / POS"},
    {key: "accounting", name: "Kế toán"},
    {key: "users", name: "Tài khoản"},
    {key: "login-history", name: "Lịch sử đăng nhập"},
    {key: "branches", name: "Chi nhánh"},
    {key: "products", name: "Sản phẩm"},
    {key: "inventory", name: "Kho xe"},
    {key: "purchases", name: "Nhập hàng"},
    {key: "suppliers", name: "Nhà cung cấp"},
    {key: "customers", name: "Khách hàng"},
    {key: "service", name: "Bảo hành"},
    {key: "marketing", name: "Marketing"},
    {key: "channels", name: "Kênh bán hàng"},
    {key: "reports", name: "Báo cáo"},
    {key: "automation", name: "AI & tích hợp"}
];

const DEFAULT_MODULES_BY_ROLE = {
    ADMIN: MODULE_CATALOG.map(item => item.key),
    ACCOUNTANT: ["dashboard", "accounting", "customers", "suppliers", "reports", "login-history"],
    CASHIER: ["dashboard", "pos", "customers", "products", "inventory", "reports"],
    BRANCH_MANAGER: ["dashboard", "pos", "branches", "products", "inventory", "purchases", "suppliers", "customers", "service", "marketing", "channels", "reports"],
    SALES: ["dashboard", "pos", "products", "inventory", "customers", "marketing", "channels"],
    SERVICE: ["dashboard", "products", "inventory", "customers", "service"]
};

const mock = {
    branches: [
        {id: 1, name: "CS1 - Chuẩn Phát Lê Viết Thuật", address: "Số 389 Lê Viết Thuật, Vinh Lộc, Nghệ An", phone: "0832.032.555", active: true},
        {id: 2, name: "CS2 - Chuẩn Phát Nguyễn Trãi", address: "Số 7 Nguyễn Trãi, P. Vinh Hưng, Nghệ An", phone: "0832.058.555", active: true},
        {id: 3, name: "CS3 - Chuẩn Phát Nam Đàn", address: "Số 238, QL46, TT. Nam Đàn, Nghệ An", phone: "0832.028.555", active: true},
        {id: 4, name: "CS4 - Chuẩn Phát Nguyễn Du", address: "Số 116 Nguyễn Du, P. Trường Vinh, Nghệ An", phone: "0815.016.555", active: true},
        {id: 5, name: "CS5 - Chuẩn Phát Lê Lợi", address: "Số 60 Lê Lợi, P. Thành Vinh, Nghệ An", phone: "0815.018.555", active: true},
        {id: 6, name: "Xưởng dịch vụ VinFast Chuẩn Phát", address: "Số 389 Lê Viết Thuật, Vinh Lộc, Nghệ An", phone: "0912.186.586", active: true}
    ],
    products: [
        {id: 1, name: "Xe máy điện Evo200", brand: "VinFast", model: "Evo200", color: "Trắng cam", category: "E_MOTORBIKE", battery: "LFP 3.5 kWh", warrantyMonths: 36, price: 22000000, qrCode: "CP-EVO200", specifications: "Tầm hoạt động khoảng 200 km"},
        {id: 2, name: "Xe đạp điện Vento", brand: "Yadea", model: "Vento", color: "Xanh", category: "E_BICYCLE", battery: "Lithium", warrantyMonths: 24, price: 12500000, qrCode: "CP-VENTO", specifications: "Nhỏ gọn, tiết kiệm"}
    ],
    inventory: [
        {id: 1, branch: {id: 1, name: "CS1 - Chuẩn Phát Lê Viết Thuật"}, product: {id: 1, name: "Xe máy điện Evo200", price: 22000000}, serialNumber: "SN-EVO-0001", imei: "IMEI-EVO-0001", vehicleCode: "CP001", status: "IN_STOCK", costPrice: 18000000},
        {id: 2, branch: {id: 2, name: "CS2 - Chuẩn Phát Nguyễn Trãi"}, product: {id: 2, name: "Xe đạp điện Vento", price: 12500000}, serialNumber: "SN-VEN-0001", imei: "IMEI-VEN-0001", vehicleCode: "CP002", status: "IN_STOCK", costPrice: 9000000},
        {id: 3, branch: {id: 3, name: "CS3 - Chuẩn Phát Nam Đàn"}, product: {id: 1, name: "Xe máy điện Evo200", price: 22000000}, serialNumber: "SN-EVO-0002", imei: "IMEI-EVO-0002", vehicleCode: "CP003", status: "SOLD", costPrice: 18000000}
    ],
    movements: [
        {id: 1, type: "IMPORT", product: {name: "Xe máy điện Evo200"}, toBranch: {name: "CS1 - Chuẩn Phát Lê Viết Thuật"}, quantity: 1, referenceCode: "SN-EVO-0001", unitCost: 18000000, note: "Nhập kho đầu kỳ"},
        {id: 2, type: "SALE", product: {name: "Xe máy điện Evo200"}, fromBranch: {name: "CS3 - Chuẩn Phát Nam Đàn"}, quantity: 1, referenceCode: "SN-EVO-0002", unitCost: 18000000, note: "Xuất bán"}
    ],
    stocktakes: [
        {id: 1, branch: {name: "CS1 - Chuẩn Phát Lê Viết Thuật"}, product: {name: "Xe máy điện Evo200"}, systemQuantity: 1, actualQuantity: 1, differenceQuantity: 0, status: "APPROVED", note: "Kiểm kê đầu kỳ"}
    ],
    customers: [
        {id: 1, fullName: "Nguyễn Văn A", phone: "0912345678", email: "a@example.com", tier: "NEW", source: "Facebook", birthday: "1992-05-20", loyaltyPoints: 120},
        {id: 2, fullName: "Trần Thị B", phone: "0987654321", email: "b@example.com", tier: "VIP", source: "Zalo OA", birthday: "1989-11-02", loyaltyPoints: 950}
    ],
    conversations: [
        {id: 1, channel: "FACEBOOK", customerName: "Lê Minh C", customerPhone: "0901111222", leadTag: "hỏi trả góp", message: "Khách hỏi giá xe máy điện và trả góp.", status: "NEW"},
        {id: 2, channel: "ZALO_OA", customerName: "Phạm Anh D", customerPhone: "0903333444", leadTag: "bảo dưỡng", message: "Khách cần nhắc lịch bảo dưỡng.", status: "NEW"},
        {id: 3, channel: "TIKTOK", customerName: "Hoàng E", customerPhone: "0905555666", leadTag: "khách nóng", message: "Khách đến từ livestream TikTok.", status: "ASSIGNED"}
    ],
    sales: [],
    accounting: [
        {id: 1, voucherCode: "KT-0001", entryDate: "2026-05-12", type: "INCOME", category: "Doanh thu bán xe", branch: {id: 1, name: "CS1 - Chuẩn Phát Lê Viết Thuật"}, partnerName: "Nguyễn Văn A", amount: 22000000, paymentMethod: "CASH", status: "POSTED", description: "Thu tiền bán xe"},
        {id: 2, voucherCode: "KT-0002", entryDate: "2026-05-12", type: "EXPENSE", category: "Chi phí vận hành", branch: {id: 1, name: "CS1 - Chuẩn Phát Lê Viết Thuật"}, partnerName: "Điện lực Nghệ An", amount: 2500000, paymentMethod: "BANK_TRANSFER", status: "POSTED"},
        {id: 3, voucherCode: "KT-0003", entryDate: "2026-05-12", type: "PAYABLE", category: "Công nợ nhà cung cấp", branch: {id: 2, name: "CS2 - Chuẩn Phát Nguyễn Trãi"}, partnerName: "VinFast", amount: 18000000, paymentMethod: "BANK_TRANSFER", status: "PARTIAL"},
        {id: 4, voucherCode: "KT-0004", entryDate: "2026-05-12", type: "RECEIVABLE", category: "Khách trả góp", branch: {id: 3, name: "CS3 - Chuẩn Phát Nam Đàn"}, partnerName: "Trần Thị B", amount: 12500000, paymentMethod: "INSTALLMENT", status: "PARTIAL"}
    ],
    accounts: [
        {id: 1, accountCode: "111", accountName: "Tiền mặt", accountType: "ASSET", balance: 120000000},
        {id: 2, accountCode: "112", accountName: "Tiền gửi ngân hàng", accountType: "ASSET", balance: 350000000},
        {id: 3, accountCode: "131", accountName: "Phải thu khách hàng", accountType: "ASSET", balance: 30000000},
        {id: 4, accountCode: "331", accountName: "Phải trả nhà cung cấp", accountType: "LIABILITY", balance: 18000000}
    ],
    suppliers: [
        {id: 1, name: "VinFast", phone: "1900232389", email: "ncc@vinfast.vn", address: "Hà Nội", taxCode: "VINFAST", contactPerson: "Phòng kinh doanh", debtBalance: 18000000, active: true},
        {id: 2, name: "Yadea Việt Nam", phone: "18006923", email: "ncc@yadea.vn", address: "Việt Nam", taxCode: "YADEA", contactPerson: "Phòng phân phối", debtBalance: 0, active: true}
    ],
    purchases: [
        {id: 1, purchaseCode: "PN-0001", supplier: {id: 1, name: "VinFast"}, branch: {id: 1, name: "CS1 - Chuẩn Phát Lê Viết Thuật"}, orderDate: "2026-05-12", dueDate: "2026-05-27", total: 36000000, paidAmount: 18000000, status: "PARTIAL", items: [{product: {name: "Xe máy điện Evo200"}, quantity: 2, unitCost: 18000000, lineTotal: 36000000}]}
    ],
    serviceTickets: [
        {id: 1, ticketCode: "BH-0001", branch: {name: "CS1 - Chuẩn Phát Lê Viết Thuật"}, customer: {fullName: "Nguyễn Văn A"}, inventoryItem: {serialNumber: "SN-EVO-0001"}, status: "DIAGNOSING", issueDescription: "Kiểm tra pin và phanh", replacementParts: "Chưa thay thế", serviceCost: 0, appointmentDate: "2026-05-16", warrantyUntil: "2029-05-12"}
    ],
    vouchers: [
        {id: 1, code: "CP500", name: "Giảm 500k khi mua xe điện", type: "FIXED_AMOUNT", value: 500000, minOrderValue: 10000000, startDate: "2026-05-12", endDate: "2026-06-12", usageLimit: 200, usedCount: 0, active: true},
        {id: 2, code: "VIP3", name: "Khách VIP giảm 3%", type: "PERCENTAGE", value: 3, minOrderValue: 15000000, startDate: "2026-05-12", endDate: "2026-08-12", usageLimit: null, usedCount: 0, active: true}
    ],
    users: [
        {id: 1, username: "admin", displayName: "Quản trị hệ thống", phone: "0912.186.586", role: "ADMIN", branch: null, active: true},
        {id: 2, username: "ketoan", displayName: "Kế toán Chuẩn Phát", phone: "0832.032.555", role: "ACCOUNTANT", branch: {id: 1, name: "CS1 - Chuẩn Phát Lê Viết Thuật"}, active: true}
    ],
    logs: [
        {id: 1, actorName: "system", moduleName: "SYSTEM", actionName: "INIT", description: "Tạo dữ liệu mẫu offline", createdAt: "2026-05-13T08:00:00"},
        {id: 2, actorName: "Quản trị hệ thống", moduleName: "AUTH", actionName: "LOGIN", description: "Đăng nhập hệ thống", createdAt: "2026-05-13T08:05:00"},
        {id: 3, actorName: "Kế toán Chuẩn Phát", moduleName: "AUTH", actionName: "LOGIN", description: "Đăng nhập hệ thống", createdAt: "2026-05-13T08:12:00"},
        {id: 4, actorName: "Kế toán Chuẩn Phát", moduleName: "AUTH", actionName: "LOGOUT", description: "Đăng xuất hệ thống", createdAt: "2026-05-13T09:20:00"}
    ]
};

mock.permissions = buildDefaultPermissionStore(mock.users);
const state = structuredClone(mock);
let apiOnline = false;
let signedUser = null;
const loadingPermissionUsers = new Set();
const SESSION_KEY = "chuanphat.signedUser";

const pages = {
    dashboard: ["Phân hệ", "Các nhóm nghiệp vụ, danh mục và tình hình kinh doanh của ChuanPhat."],
    pos: ["Bán hàng / POS", "Tạo hóa đơn, voucher, đặt cọc, QR Banking và trả góp."],
    accounting: ["Kế toán", "Thu chi, công nợ, sổ quỹ, ngân hàng, thuế và tài khoản kế toán."],
    users: ["Tài khoản", "Đăng nhập, phân quyền và nhật ký hoạt động."],
    "login-history": ["Lịch sử đăng nhập", "Theo dõi đăng nhập, đăng xuất và thời điểm thao tác của từng tài khoản."],
    branches: ["Chi nhánh", "Quản lý showroom, xưởng dịch vụ và doanh thu từng điểm bán."],
    products: ["Sản phẩm", "Danh mục xe, QR, serial, IMEI và bảo hành."],
    inventory: ["Kho xe", "Nhập, xuất, chuyển, kiểm kê và lịch sử tồn kho."],
    purchases: ["Nhập hàng", "Đơn nhập hàng, giá vốn và công nợ nhà cung cấp."],
    suppliers: ["Nhà cung cấp", "Thông tin NCC, công nợ và lịch sử nhập hàng."],
    customers: ["Khách hàng", "CRM, điểm tích lũy, hạng thành viên và chăm sóc khách hàng."],
    service: ["Bảo hành", "Phiếu bảo hành, sửa chữa, linh kiện và lịch hẹn."],
    marketing: ["Marketing", "Voucher, mã giảm giá, remarketing và nhắc bảo dưỡng."],
    channels: ["Kênh bán hàng", "Lead Zalo OA, Facebook Messenger và TikTok."],
    reports: ["Báo cáo", "Doanh thu, lợi nhuận, tồn kho và công nợ."],
    automation: ["AI & tích hợp", "Các tích hợp nâng cao khi chuyển sang online."]
};

document.querySelectorAll(".nav").forEach(button => {
    button.addEventListener("click", () => switchView(button.dataset.view));
});
document.querySelectorAll("[data-go-view]").forEach(button => {
    button.addEventListener("click", () => switchView(button.dataset.goView));
});
document.querySelectorAll("[data-open]").forEach(button => {
    button.addEventListener("click", () => document.getElementById(button.dataset.open).classList.toggle("hidden"));
});
document.getElementById("global-search").addEventListener("input", render);
document.getElementById("module-search")?.addEventListener("input", filterModuleBoard);
document.getElementById("refresh-report").addEventListener("click", loadData);
document.getElementById("refresh-login-history").addEventListener("click", loadData);
document.getElementById("logout-button").addEventListener("click", logout);
document.getElementById("print-receipt")?.addEventListener("click", () => window.print());
document.getElementById("permission-user")?.addEventListener("change", async event => {
    await ensurePermissionsForUser(Number(event.target.value));
    renderPermissionEditor();
});
document.getElementById("save-permissions")?.addEventListener("click", savePermissions);
document.addEventListener("click", handleDeleteClick);

bindForm("branch-form", "/branches", value => ({
    name: value.name, address: value.address, phone: value.phone,
    latitude: numberOrNull(value.latitude), longitude: numberOrNull(value.longitude), active: true
}), "branches");

bindForm("product-form", "/products", value => ({
    name: value.name, brand: value.brand, model: value.model, color: value.color, category: value.category,
    battery: value.battery, warrantyMonths: numberOrNull(value.warrantyMonths), price: numberOrNull(value.price),
    qrCode: value.qrCode, imageUrl: value.imageUrl, specifications: value.specifications
}), "products");

bindForm("inventory-form", "/inventory", value => ({
    branchId: numberOrNull(value.branchId), productId: numberOrNull(value.productId),
    serialNumber: value.serialNumber, imei: value.imei, vehicleCode: value.vehicleCode, costPrice: numberOrNull(value.costPrice)
}), "inventory");

bindForm("stocktake-form", "/inventory/stocktakes", value => ({
    branchId: numberOrNull(value.branchId), productId: numberOrNull(value.productId),
    actualQuantity: numberOrNull(value.actualQuantity), note: value.note, status: "DRAFT"
}), "stocktakes");

bindForm("customer-form", "/customers", value => ({
    fullName: value.fullName, phone: value.phone, email: value.email, address: value.address,
    birthday: value.birthday || null, loyaltyPoints: numberOrNull(value.loyaltyPoints) || 0,
    tier: value.tier, source: value.source
}), "customers");

bindForm("conversation-form", "/channels/conversations", value => ({
    channel: value.channel, customerName: value.customerName, customerPhone: value.customerPhone,
    leadTag: value.leadTag, message: value.message, status: "NEW"
}), "conversations");

bindForm("accounting-form", "/accounting/entries", value => ({
    entryDate: value.entryDate || null, type: value.type, category: value.category,
    branchId: numberOrNull(value.branchId), partnerName: value.partnerName, description: value.description,
    amount: numberOrNull(value.amount), paymentMethod: value.paymentMethod, status: value.status
}), "accounting");

bindForm("account-form", "/accounting/accounts", value => ({
    accountCode: value.accountCode, accountName: value.accountName, accountType: value.accountType,
    balance: numberOrNull(value.balance) || 0, active: true
}), "accounts");

bindForm("user-form", "/users", value => ({
    username: value.username, password: value.password, displayName: value.displayName, phone: value.phone,
    role: value.role, branchId: numberOrNull(value.branchId), active: true
}), "users");

bindForm("supplier-form", "/suppliers", value => ({
    name: value.name, phone: value.phone, email: value.email, address: value.address, taxCode: value.taxCode,
    contactPerson: value.contactPerson, debtBalance: numberOrNull(value.debtBalance) || 0, active: true
}), "suppliers");

bindForm("purchase-form", "/purchases", value => ({
    supplierName: value.supplierName, branchName: value.branchName, dueDate: value.dueDate || null,
    paidAmount: numberOrNull(value.paidAmount) || 0, discount: 0, tax: 0, status: "ORDERED",
    items: [{
        productName: value.productName,
        productColor: value.productColor,
        productCategory: "E_MOTORBIKE",
        quantity: numberOrNull(value.quantity) || 1,
        unitCost: numberOrNull(value.unitCost) || 0
    }]
}), "purchases");

bindForm("service-form", "/service-tickets", value => ({
    branchId: numberOrNull(value.branchId), customerId: numberOrNull(value.customerId), inventoryItemId: numberOrNull(value.inventoryItemId),
    status: value.status, issueDescription: value.issueDescription, diagnosis: value.diagnosis, replacementParts: value.replacementParts,
    serviceCost: numberOrNull(value.serviceCost) || 0, appointmentDate: value.appointmentDate || null, warrantyUntil: value.warrantyUntil || null,
    notificationSent: false
}), "serviceTickets");

bindForm("voucher-form", "/vouchers", value => ({
    code: value.code, name: value.name, type: value.type, value: numberOrNull(value.value) || 0,
    minOrderValue: numberOrNull(value.minOrderValue) || 0, startDate: value.startDate || new Date().toISOString().slice(0, 10),
    endDate: value.endDate || null, usageLimit: numberOrNull(value.usageLimit), usedCount: 0, active: true
}), "vouchers");

bindLoginForm("gate-login-form");
bindLoginForm("login-form");

document.getElementById("sales-form").addEventListener("submit", async event => {
    event.preventDefault();
    const value = Object.fromEntries(new FormData(event.target).entries());
    const item = state.inventory.find(row => row.id === Number(value.inventoryItemId));
    if (!item) return showToast("Chưa chọn xe trong kho.");

    const voucherDiscount = calculateVoucherDiscount(value.voucherCode, item.product?.price || 0);
    const payload = {
        branchId: Number(value.branchId),
        customerName: value.customerName,
        customerPhone: value.customerPhone,
        customerAddress: value.customerAddress,
        discount: Number(value.discount || 0) + voucherDiscount,
        tax: Number(value.tax || 0),
        depositAmount: Number(value.depositAmount || 0),
        voucherCode: value.voucherCode || null,
        paymentMethod: value.paymentMethod,
        items: [{productId: item.product.id, inventoryItemId: item.id, quantity: 1, unitPrice: item.product.price || 0}]
    };

    try {
        const order = apiOnline ? await api("/sales", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(payload)}) : fakeOrder(payload);
        state.sales.unshift(order);
        await loadData(false);
        renderReceipt(order);
        showToast("Đã lập hóa đơn bán hàng.");
    } catch (error) {
        showToast(error.message);
    }
});

function switchView(view) {
    if (!pages[view]) return;
    if (!hasModuleAccess(view)) {
        showToast("Tài khoản này chưa được cấp quyền vào hạng mục này.");
        return;
    }
    document.querySelectorAll(".nav").forEach(item => item.classList.toggle("active", item.dataset.view === view));
    document.querySelectorAll("[data-go-view]").forEach(item => item.classList.toggle("active", item.dataset.goView === view));
    document.querySelectorAll(".view").forEach(item => item.classList.toggle("active", item.id === view));
    document.getElementById("page-title").textContent = pages[view][0];
    document.getElementById("page-subtitle").textContent = pages[view][1];
}

function filterModuleBoard() {
    const query = normalizeText(document.getElementById("module-search")?.value || "");
    document.querySelectorAll(".module-link").forEach(item => {
        const visible = !query || normalizeText(item.textContent).includes(query);
        item.classList.toggle("module-filtered", !visible);
    });
    document.querySelectorAll(".module-column").forEach(column => {
        const hasVisible = [...column.querySelectorAll(".module-link")]
            .some(item => !item.classList.contains("module-filtered") && !item.classList.contains("module-permission-hidden"));
        column.classList.toggle("module-filtered", !hasVisible);
    });
}

function normalizeText(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function bindLoginForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("submit", async event => {
        event.preventDefault();
        const value = Object.fromEntries(new FormData(form).entries());
        try {
            const user = apiOnline
                ? await api("/auth/login", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(value)})
                : state.users.find(item => item.username === value.username && value.password === "123456");
            if (!user) throw new Error("Sai tài khoản hoặc mật khẩu");
            unlockApp(user);
            if (apiOnline) {
                await loadData(false);
            } else {
                addAuthLog(user.displayName, "LOGIN", "Đăng nhập hệ thống");
            }
            showToast("Đăng nhập thành công.");
        } catch (error) {
            showToast(error.message);
        }
    });
}

function unlockApp(user) {
    signedUser = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        branch: user.branch || null
    }));
    document.body.classList.remove("locked");
    document.getElementById("signed-user").textContent = `${user.displayName} - ${roleText(user.role)}`;
    document.getElementById("signed-user").className = "status online";
    applyModulePermissions();
}

async function logout() {
    const actorName = signedUser?.displayName || "user";
    if (apiOnline) {
        await api("/auth/logout", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({actorName})}).catch(() => null);
    } else {
        addAuthLog(actorName, "LOGOUT", "Đăng xuất hệ thống");
    }
    signedUser = null;
    localStorage.removeItem(SESSION_KEY);
    document.body.classList.add("locked");
    document.getElementById("signed-user").textContent = "Chưa đăng nhập";
    document.getElementById("signed-user").className = "status waiting";
    applyModulePermissions();
    showToast("Đã đăng xuất.");
}

function bindForm(formId, path, mapper, collection) {
    const form = document.getElementById(formId);
    form.addEventListener("submit", async event => {
        event.preventDefault();
        const value = Object.fromEntries(new FormData(form).entries());
        const payload = mapper(value);
        try {
            if (apiOnline) {
                await api(path, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(payload)});
                await loadData(false);
            } else {
                fakeCreate(collection, payload);
                render();
            }
            form.reset();
            form.classList.add("hidden");
            showToast("Đã lưu dữ liệu.");
        } catch (error) {
            showToast(error.message);
        }
    });
}

async function loadData(showMessage = true) {
    let online = false;
    try {
        state.branches = await api("/branches");
        online = true;
    } catch {
        online = false;
    }

    if (online) {
        const [products, inventory, customers, conversations, sales, accounting, accounts, suppliers, purchases, movements, stocktakes, serviceTickets, vouchers, users, logs, reportSummary] = await Promise.all([
            safeApi("/products", state.products),
            safeApi("/inventory", state.inventory),
            safeApi("/customers", state.customers),
            safeApi("/channels/conversations", state.conversations),
            safeApi("/sales", state.sales),
            safeApi("/accounting/entries", state.accounting),
            safeApi("/accounting/accounts", state.accounts),
            safeApi("/suppliers", state.suppliers),
            safeApi("/purchases", state.purchases),
            safeApi("/inventory/movements", state.movements),
            safeApi("/inventory/stocktakes", state.stocktakes),
            safeApi("/service-tickets", state.serviceTickets),
            safeApi("/vouchers", state.vouchers),
            safeApi("/users", state.users),
            safeApi("/activity-logs", state.logs),
            safeApi("/reports/dashboard", null)
        ]);
        Object.assign(state, {products, inventory, customers, conversations, sales, accounting, accounts, suppliers, purchases, movements, stocktakes, serviceTickets, vouchers, users, logs, reportSummary});
    }

    apiOnline = online;
    await loadSignedUserPermissions();
    setStatus(online);
    render();
    applyModulePermissions();
    if (showMessage && online) showToast("Đã kết nối backend.");
}

async function safeApi(path, fallback) {
    try {
        return await api(path);
    } catch {
        return fallback;
    }
}

async function api(path, options) {
    const response = await fetch(API_BASE + path, options);
    if (!response.ok) {
        const error = await response.json().catch(() => ({message: "Lỗi API"}));
        throw new Error(error.message || "Lỗi API");
    }
    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

function render() {
    const query = document.getElementById("global-search").value.trim().toLowerCase();
    const branches = filterAny(state.branches, query);
    const products = filterAny(state.products, query);
    const inventory = filterAny(state.inventory, query);
    const customers = filterAny(state.customers, query);
    const conversations = filterAny(state.conversations, query);
    const accounting = filterAny(state.accounting, query);
    const suppliers = filterAny(state.suppliers, query);
    const purchases = filterAny(state.purchases, query);
    const serviceTickets = filterAny(state.serviceTickets, query);
    const vouchers = filterAny(state.vouchers, query);
    const users = filterAny(state.users, query);

    const revenue = state.sales.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const income = sumAccounting("INCOME");
    const expense = sumAccounting("EXPENSE");
    const inStock = state.inventory.filter(item => item.status === "IN_STOCK");
    document.getElementById("today-revenue").textContent = money(revenue || income);
    document.getElementById("profit-estimate").textContent = money((income || revenue) - expense);
    document.getElementById("stock-count").textContent = inStock.length;
    document.getElementById("customer-count").textContent = state.customers.length;

    renderTable("branch-list", ["ID", "Tên", "Địa chỉ", "Điện thoại", "Trạng thái"], branches.map(item => [
        item.id, item.name, item.address, item.phone || "", item.active ? "Đang mở" : "Đóng"
    ]));
    renderProducts(products);
    renderTable("inventory-list", ["ID", "Chi nhánh", "Sản phẩm", "Serial", "IMEI", "Trạng thái", "Thao tác"], inventory.map(item => [
        item.id, item.branch?.name || "", item.product?.name || "", item.serialNumber, item.imei || "", statusText(item.status), deleteButton("inventory", item.id, "xe")
    ]));
    renderTable("customer-list", ["ID", "Khách", "SĐT", "Hạng", "Điểm", "Nguồn", "Thao tác"], customers.map(item => [
        item.id, item.fullName, item.phone, tierText(item.tier), item.loyaltyPoints || 0, item.source || "", deleteButton("customers", item.id, "khách hàng")
    ]));
    renderTable("supplier-list", ["ID", "NCC", "SĐT", "MST", "Liên hệ", "Công nợ"], suppliers.map(item => [
        item.id, item.name, item.phone || "", item.taxCode || "", item.contactPerson || "", money(item.debtBalance)
    ]));
    renderTable("purchase-list", ["Mã", "NCC", "Chi nhánh", "Ngày", "Hạn trả", "Tổng", "Đã trả", "Trạng thái"], purchases.map(item => [
        item.purchaseCode || `PN-${item.id}`, item.supplier?.name || "", item.branch?.name || "", item.orderDate || "", item.dueDate || "",
        money(item.total), money(item.paidAmount), purchaseStatusText(item.status)
    ]));
    renderTable("service-list", ["Mã", "Chi nhánh", "Khách", "Serial", "Trạng thái", "Hẹn trả"], serviceTickets.map(item => [
        item.ticketCode || `BH-${item.id}`, item.branch?.name || "", item.customer?.fullName || "", item.inventoryItem?.serialNumber || "",
        serviceStatusText(item.status), item.appointmentDate || ""
    ]));
    renderTable("voucher-list", ["Mã", "Chương trình", "Loại", "Giá trị", "Đơn tối thiểu", "Hạn"], vouchers.map(item => [
        item.code, item.name, voucherTypeText(item.type), item.type === "PERCENTAGE" ? `${item.value}%` : money(item.value), money(item.minOrderValue), item.endDate || ""
    ]));
    renderTable("user-list", ["ID", "Tài khoản", "Họ tên", "Vai trò", "Chi nhánh", "Trạng thái"], users.map(item => [
        item.id, item.username, item.displayName, roleText(item.role), item.branch?.name || "Toàn hệ thống", item.active ? "Hoạt động" : "Khóa"
    ]));

    renderAccounting(accounting);
    renderBranchChart();
    renderLowStock();
    renderLatestLeads(conversations);
    renderKanban(conversations);
    renderMovements();
    renderStocktakes();
    renderActivityLogs();
    renderLoginHistory();
    renderPermissionEditor();
    renderReports();
    renderAutomation();
    populateSelects();
}

function renderTable(targetId, headers, rows) {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.style.setProperty("--cols", String(headers.length - 1));
    const header = `<div class="table-row header">${headers.map(cell).join("")}</div>`;
    const body = rows.length ? rows.map(row => `<div class="table-row">${row.map(cell).join("")}</div>`).join("") : emptyRow();
    target.innerHTML = header + body;
}

function renderPermissionEditor() {
    const select = document.getElementById("permission-user");
    const list = document.getElementById("permission-list");
    const note = document.getElementById("permission-note");
    const saveButton = document.getElementById("save-permissions");
    if (!select || !list) return;

    const current = select.value;
    select.innerHTML = state.users.map(user => `<option value="${user.id}">${escapeHtml(user.displayName)} - ${roleText(user.role)}</option>`).join("");
    if ([...select.options].some(option => option.value === current)) {
        select.value = current;
    }
    if (!select.value && state.users[0]) {
        select.value = state.users[0].id;
    }

    const userId = Number(select.value);
    const user = findById(state.users, userId);
    if (!user) {
        list.innerHTML = `<div class="muted">Chưa có tài khoản để phân quyền.</div>`;
        if (saveButton) saveButton.disabled = true;
        return;
    }

    if (apiOnline && !permissionsForUser(userId).length && !loadingPermissionUsers.has(userId)) {
        loadingPermissionUsers.add(userId);
        ensurePermissionsForUser(userId).finally(() => {
            loadingPermissionUsers.delete(userId);
            renderPermissionEditor();
        });
    }

    const canEdit = canManagePermissions() && user.role !== "ADMIN";
    const permissions = mergedPermissionsForUser(user);
    list.innerHTML = permissions.map(permission => `
        <label class="permission-item ${permission.canAccess ? "allowed" : ""}">
            <input type="checkbox" data-permission-key="${escapeHtml(permission.moduleKey)}" ${permission.canAccess ? "checked" : ""} ${canEdit ? "" : "disabled"}>
            <span>
                <strong>${escapeHtml(permission.moduleName)}</strong>
                <small>${permission.canAccess ? "Được truy cập" : "Đang khóa"}</small>
            </span>
        </label>
    `).join("");

    if (note) {
        note.textContent = user.role === "ADMIN"
            ? "Tài khoản Admin luôn có toàn quyền để tránh bị khóa khỏi hệ thống."
            : canManagePermissions()
                ? "Bật/tắt hạng mục rồi bấm Lưu phân quyền."
                : "Chỉ Admin mới được chỉnh phân quyền.";
    }
    if (saveButton) saveButton.disabled = !canEdit;
}

async function savePermissions() {
    if (!canManagePermissions()) {
        showToast("Chỉ Admin mới được chỉnh phân quyền.");
        return;
    }
    const select = document.getElementById("permission-user");
    const userId = Number(select?.value);
    const user = findById(state.users, userId);
    if (!user) return;
    if (user.role === "ADMIN") {
        showToast("Admin luôn có toàn quyền.");
        return;
    }

    const checked = new Set([...document.querySelectorAll("[data-permission-key]:checked")].map(input => input.dataset.permissionKey));
    const permissions = MODULE_CATALOG.map(module => ({
        userId,
        moduleKey: module.key,
        moduleName: module.name,
        canAccess: checked.has(module.key)
    }));

    try {
        const saved = apiOnline
            ? await api(`/users/${userId}/permissions`, {method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify(permissions)})
            : permissions;
        replaceUserPermissions(userId, saved || permissions);
        if (signedUser?.id === userId) applyModulePermissions();
        renderPermissionEditor();
        showToast("Đã lưu phân quyền tài khoản.");
    } catch (error) {
        showToast(error.message);
    }
}

async function loadSignedUserPermissions() {
    if (!signedUser?.id) return;
    const freshUser = findById(state.users, signedUser.id);
    if (freshUser) signedUser = {...signedUser, ...freshUser};
    await ensurePermissionsForUser(signedUser.id);
}

async function ensurePermissionsForUser(userId) {
    const user = findById(state.users, userId) || (signedUser?.id === userId ? signedUser : null);
    if (!user) return;
    if (!apiOnline) {
        if (!permissionsForUser(userId).length) {
            replaceUserPermissions(userId, defaultPermissionsForUser(user));
        }
        return;
    }
    try {
        const permissions = await api(`/users/${userId}/permissions`);
        replaceUserPermissions(userId, permissions);
    } catch {
        if (!permissionsForUser(userId).length) {
            replaceUserPermissions(userId, defaultPermissionsForUser(user));
        }
    }
}

function applyModulePermissions() {
    document.querySelectorAll(".nav").forEach(button => {
        const allowed = hasModuleAccess(button.dataset.view);
        button.classList.toggle("nav-hidden", !allowed);
        button.disabled = !allowed;
    });
    document.querySelectorAll("[data-go-view]").forEach(button => {
        const allowed = hasModuleAccess(button.dataset.goView);
        button.classList.toggle("module-permission-hidden", !allowed);
        button.disabled = !allowed;
    });
    filterModuleBoard();
    const activeView = document.querySelector(".view.active")?.id || "dashboard";
    if (signedUser && !hasModuleAccess(activeView)) {
        switchView(firstAccessibleModuleKey());
    }
}

function hasModuleAccess(moduleKey) {
    if (!signedUser || !moduleKey) return true;
    if (signedUser.role === "ADMIN") return true;
    const permission = mergedPermissionsForUser(signedUser).find(item => item.moduleKey === moduleKey);
    return permission ? permission.canAccess !== false : defaultCanAccess(signedUser.role, moduleKey);
}

function canManagePermissions() {
    return signedUser?.role === "ADMIN";
}

function firstAccessibleModuleKey() {
    return MODULE_CATALOG.find(module => hasModuleAccess(module.key))?.key || "dashboard";
}

function permissionsForUser(userId) {
    return state.permissions.filter(permission => Number(permission.userId) === Number(userId));
}

function mergedPermissionsForUser(user) {
    const stored = permissionsForUser(user.id);
    const byKey = Object.fromEntries(stored.map(permission => [permission.moduleKey, permission]));
    return MODULE_CATALOG.map(module => {
        const permission = byKey[module.key];
        return {
            userId: user.id,
            moduleKey: module.key,
            moduleName: permission?.moduleName || module.name,
            canAccess: permission ? permission.canAccess !== false : defaultCanAccess(user.role, module.key)
        };
    });
}

function replaceUserPermissions(userId, permissions) {
    state.permissions = state.permissions.filter(permission => Number(permission.userId) !== Number(userId));
    state.permissions.push(...(permissions || []).map(permission => ({
        userId: Number(permission.userId || userId),
        moduleKey: permission.moduleKey,
        moduleName: permission.moduleName || MODULE_CATALOG.find(module => module.key === permission.moduleKey)?.name || permission.moduleKey,
        canAccess: permission.canAccess !== false
    })));
}

function buildDefaultPermissionStore(users) {
    return users.flatMap(defaultPermissionsForUser);
}

function defaultPermissionsForUser(user) {
    return MODULE_CATALOG.map(module => ({
        userId: user.id,
        moduleKey: module.key,
        moduleName: module.name,
        canAccess: defaultCanAccess(user.role, module.key)
    }));
}

function defaultCanAccess(role, moduleKey) {
    if (role === "ADMIN") return true;
    return (DEFAULT_MODULES_BY_ROLE[role] || DEFAULT_MODULES_BY_ROLE.SALES).includes(moduleKey);
}

function handleDeleteClick(event) {
    const button = event.target.closest("[data-delete-type]");
    if (!button) return;
    deleteData(button.dataset.deleteType, Number(button.dataset.deleteId), button.dataset.deleteLabel || "dữ liệu");
}

async function deleteData(type, id, label) {
    if (!canDeleteData()) {
        showToast("Chỉ tài khoản Admin mới có quyền xóa dữ liệu.");
        return;
    }
    if (!confirm(`Xóa ${label} này? Thao tác này không thể hoàn tác.`)) return;

    const endpoints = {
        customers: "/customers",
        products: "/products",
        inventory: "/inventory"
    };
    try {
        if (apiOnline) {
            await api(`${endpoints[type]}/${id}`, {method: "DELETE"});
            await loadData(false);
        } else {
            deleteLocal(type, id);
            render();
        }
        showToast(`Đã xóa ${label}.`);
    } catch (error) {
        showToast(error.message);
    }
}

function deleteLocal(type, id) {
    if (type === "customers") {
        state.customers = state.customers.filter(item => item.id !== id);
        return;
    }
    if (type === "products") {
        state.products = state.products.filter(item => item.id !== id);
        state.inventory = state.inventory.filter(item => item.product?.id !== id);
        return;
    }
    if (type === "inventory") {
        state.inventory = state.inventory.filter(item => item.id !== id);
    }
}

function canDeleteData() {
    return signedUser?.role === "ADMIN";
}

function deleteButton(type, id, label) {
    if (!canDeleteData()) return "";
    return rawCell(`<button class="danger-button table-action" data-delete-type="${type}" data-delete-id="${id}" data-delete-label="${escapeHtml(label)}">Xóa</button>`);
}

function renderAccounting(entries) {
    const income = sumAccounting("INCOME");
    const expense = sumAccounting("EXPENSE");
    const receivable = sumAccounting("RECEIVABLE");
    const payable = sumAccounting("PAYABLE");
    document.getElementById("accounting-income").textContent = money(income);
    document.getElementById("accounting-expense").textContent = money(expense);
    document.getElementById("accounting-receivable").textContent = money(receivable);
    document.getElementById("accounting-payable").textContent = money(payable);

    renderTable("accounting-list", ["Mã", "Ngày", "Loại", "Hạng mục", "Đối tượng", "Số tiền"], entries.map(item => [
        item.voucherCode || `KT-${item.id}`, item.entryDate || "", accountingTypeText(item.type),
        item.category || "", item.partnerName || item.branch?.name || "", money(item.amount)
    ]));
    document.getElementById("account-list").innerHTML = state.accounts.map(item => `
        <div class="stack-item"><div><strong>${escapeHtml(item.accountCode)} - ${escapeHtml(item.accountName)}</strong><small>${escapeHtml(item.accountType || "")}</small></div><span>${money(item.balance)}</span></div>
    `).join("");
}

function renderProducts(products) {
    document.getElementById("product-list").innerHTML = products.length ? products.map(product => `
        <article class="product-card">
            ${product.imageUrl ? `<img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name)}">` : `<div class="product-image">${escapeHtml(product.brand || "EV")}</div>`}
            <div class="product-body">
                <h3>${escapeHtml(product.name)}</h3>
                <div class="meta-line"><span>Model</span><strong>${escapeHtml(product.model || "-")}</strong></div>
                <div class="meta-line"><span>Màu</span><strong>${escapeHtml(product.color || "-")}</strong></div>
                <div class="meta-line"><span>Loại</span><strong>${categoryText(product.category)}</strong></div>
                <div class="meta-line"><span>QR</span><strong>${escapeHtml(product.qrCode || "-")}</strong></div>
                <div class="meta-line"><span>Bảo hành</span><strong>${product.warrantyMonths || 0} tháng</strong></div>
                <div class="meta-line"><span>Giá</span><strong>${money(product.price)}</strong></div>
                ${canDeleteData() ? `<button class="danger-button" data-delete-type="products" data-delete-id="${product.id}" data-delete-label="sản phẩm">Xóa sản phẩm</button>` : ""}
            </div>
        </article>
    `).join("") : `<div class="panel">Chưa có sản phẩm.</div>`;
}

function renderBranchChart() {
    const data = state.branches.map(branch => {
        const total = state.sales.filter(order => order.branch?.id === branch.id || order.branchId === branch.id)
            .reduce((sum, order) => sum + Number(order.total || 0), 0);
        return {name: branch.name, total: total || branch.id * 18000000};
    });
    renderBars("branch-chart", data, "total", "name", money);
}

function renderLowStock() {
    const rows = state.products.map(product => ({
        name: product.name,
        count: state.inventory.filter(item => item.product?.id === product.id && item.status === "IN_STOCK").length
    })).filter(item => item.count <= 1);
    document.getElementById("low-stock-list").innerHTML = rows.length ? rows.map(item => `
        <div class="stack-item"><div><strong>${escapeHtml(item.name)}</strong><small>Còn ${item.count} xe</small></div><span class="badge danger">Thấp</span></div>
    `).join("") : `<div class="stack-item"><strong>Tồn kho ổn định</strong><span class="badge success">OK</span></div>`;
}

function renderLatestLeads(items) {
    document.getElementById("latest-leads").innerHTML = items.slice(0, 4).map(item => `
        <div class="stack-item"><div><strong>${escapeHtml(item.customerName || "Khách mới")}</strong><small>${channelText(item.channel)} - ${escapeHtml(item.leadTag || "")}</small></div><span class="badge">${statusText(item.status)}</span></div>
    `).join("");
}

function renderKanban(items) {
    const columns = [["NEW", "Lead mới"], ["ASSIGNED", "Đang tư vấn"], ["CLOSED", "Đã đóng"]];
    document.getElementById("conversation-board").innerHTML = columns.map(([status, title]) => `
        <div class="kanban-col">
            <div class="panel-head"><h2>${title}</h2><span class="badge">${items.filter(item => item.status === status).length}</span></div>
            ${items.filter(item => item.status === status).map(item => `
                <div class="lead-card"><strong>${escapeHtml(item.customerName || "Khách chưa tên")}</strong><small>${channelText(item.channel)} - ${escapeHtml(item.customerPhone || "")}</small><p>${escapeHtml(item.message || "")}</p><small>${escapeHtml(item.leadTag || "")}</small></div>
            `).join("") || `<div class="muted">Không có hội thoại.</div>`}
        </div>
    `).join("");
}

function renderMovements() {
    document.getElementById("movement-list").innerHTML = state.movements.slice(0, 8).map(item => `
        <div class="stack-item"><div><strong>${movementText(item.type)} - ${escapeHtml(item.referenceCode || "")}</strong><small>${escapeHtml(item.product?.name || "")} ${escapeHtml(item.fromBranch?.name || item.toBranch?.name || "")}</small></div><span>${item.quantity || 1}</span></div>
    `).join("");
}

function renderStocktakes() {
    document.getElementById("stocktake-list").innerHTML = state.stocktakes.slice(0, 8).map(item => `
        <div class="stack-item"><div><strong>${escapeHtml(item.product?.name || "")}</strong><small>${escapeHtml(item.branch?.name || "")}</small></div><span>${item.actualQuantity}/${item.systemQuantity}</span></div>
    `).join("");
}

function renderActivityLogs() {
    document.getElementById("activity-log-list").innerHTML = state.logs.slice(0, 8).map(item => `
        <div class="stack-item"><div><strong>${escapeHtml(item.actorName || "system")}</strong><small>${escapeHtml(item.moduleName || "")} - ${escapeHtml(item.actionName || "")}</small></div><span>${escapeHtml(item.description || "")}</span></div>
    `).join("");
}

function renderLoginHistory() {
    const authLogs = state.logs
        .filter(item => item.moduleName === "AUTH" && ["LOGIN", "LOGOUT"].includes(item.actionName))
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const loginCount = authLogs.filter(item => item.actionName === "LOGIN").length;
    const logoutCount = authLogs.filter(item => item.actionName === "LOGOUT").length;
    const lastLog = authLogs[0];

    document.getElementById("login-count").textContent = loginCount;
    document.getElementById("logout-count").textContent = logoutCount;
    document.getElementById("last-login-user").textContent = lastLog?.actorName || "-";
    document.getElementById("login-history-status").textContent = apiOnline ? "Online" : "Offline";

    renderTable("login-history-list", ["ID", "Tài khoản", "Hành động", "Mô tả", "Thời gian"], authLogs.map(item => [
        item.id,
        item.actorName || "system",
        item.actionName === "LOGIN" ? "Đăng nhập" : "Đăng xuất",
        item.description || "",
        formatDateTime(item.createdAt)
    ]));
}

function renderReports() {
    const soldCounts = state.products.map(product => ({
        name: product.name,
        count: state.inventory.filter(item => item.product?.id === product.id && item.status === "SOLD").length
    }));
    renderBars("top-products", soldCounts, "count", "name", value => `${value} xe`);

    const sources = countBy(state.customers, item => item.source || "Khác");
    document.getElementById("source-report").innerHTML = Object.entries(sources).map(([name, count]) => `
        <div class="stack-item"><strong>${escapeHtml(name)}</strong><span>${count} khách</span></div>
    `).join("");

    document.getElementById("debt-report").innerHTML = [
        ["Phải thu khách hàng", sumAccounting("RECEIVABLE")],
        ["Phải trả nhà cung cấp", sumAccounting("PAYABLE") + state.suppliers.reduce((sum, item) => sum + Number(item.debtBalance || 0), 0)],
        ["Tổng công nợ NCC", state.suppliers.reduce((sum, item) => sum + Number(item.debtBalance || 0), 0)]
    ].map(([name, value]) => `<div class="stack-item"><strong>${escapeHtml(name)}</strong><span>${money(value)}</span></div>`).join("");
}

function renderAutomation() {
    const items = [
        ["VietQR / QR Banking", "Sẵn sàng cấu hình khi có tài khoản ngân hàng"],
        ["VNPay / Momo", "Cần tài khoản merchant để tích hợp thanh toán"],
        ["Zalo OA", "Cần OA ID, secret key và webhook online"],
        ["Facebook Messenger", "Cần fanpage token và webhook online"],
        ["TikTok Lead", "Cần TikTok Business API"],
        ["Google Maps", "Cần API key để hiển thị bản đồ chi nhánh"],
        ["Firebase Notification", "Dùng cho app mobile và thông báo realtime"],
        ["AI dự báo", "Cần dữ liệu bán hàng đủ lớn để huấn luyện/gợi ý"]
    ];
    document.getElementById("automation-list").innerHTML = items.map(([name, detail]) => `
        <article class="panel"><div class="panel-head"><h2>${escapeHtml(name)}</h2><span class="badge">Chờ cấu hình</span></div><p>${escapeHtml(detail)}</p></article>
    `).join("");
}

function renderBars(targetId, data, valueKey, labelKey, formatter) {
    const max = Math.max(...data.map(item => Number(item[valueKey]) || 0), 1);
    document.getElementById(targetId).innerHTML = data.map(item => {
        const value = Number(item[valueKey]) || 0;
        const width = Math.max(6, Math.round((value / max) * 100));
        return `<div class="bar-row"><strong>${escapeHtml(item[labelKey])}</strong><div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div><span>${formatter(value)}</span></div>`;
    }).join("");
}

function populateSelects() {
    const stockItems = state.inventory.filter(item => item.status === "IN_STOCK");
    fillSelect("sale-branch", state.branches, item => item.id, item => `${item.id} - ${item.name}`);
    fillDatalist("sale-customer-options", state.customers, item => item.fullName);
    fillSelect("sale-inventory", stockItems, item => item.id, item => `${item.id} - ${item.product?.name || "Xe"} - ${item.serialNumber}`);
    fillSelect("sale-voucher", state.vouchers.filter(item => item.active !== false), item => item.code, item => `${item.code} - ${item.name}`, "Không dùng voucher");
    ["accounting-branch", "user-branch", "inventory-branch", "stocktake-branch", "service-branch"].forEach(id => {
        fillSelect(id, state.branches, item => item.id, item => `${item.id} - ${item.name}`, id === "user-branch" ? "Toàn hệ thống" : null);
    });
    ["inventory-product", "stocktake-product"].forEach(id => fillSelect(id, state.products, item => item.id, item => `${item.id} - ${item.name}`));
    fillDatalist("supplier-options", state.suppliers, item => item.name);
    fillDatalist("branch-options", state.branches, item => item.name);
    fillDatalist("product-options", state.products, item => item.name);
    fillSelect("service-customer", state.customers, item => item.id, item => `${item.id} - ${item.fullName}`, "Khách lẻ");
    fillSelect("service-inventory", state.inventory, item => item.id, item => `${item.id} - ${item.serialNumber}`, "Không chọn serial");
}

function fillSelect(id, items, valueFn, labelFn, emptyLabel = null) {
    const select = document.getElementById(id);
    if (!select) return;
    const current = select.value;
    const empty = emptyLabel == null ? "" : `<option value="">${escapeHtml(emptyLabel)}</option>`;
    select.innerHTML = empty + items.map(item => `<option value="${valueFn(item)}">${escapeHtml(labelFn(item))}</option>`).join("");
    if ([...select.options].some(option => option.value === current)) select.value = current;
}

function fillDatalist(id, items, labelFn) {
    const datalist = document.getElementById(id);
    if (!datalist) return;
    const labels = [...new Set(items.map(labelFn).filter(Boolean))];
    datalist.innerHTML = labels.map(label => `<option value="${escapeHtml(label)}"></option>`).join("");
}

function fakeCreate(collection, payload) {
    const item = {...payload, id: Date.now()};
    if (collection === "inventory") {
        item.branch = findById(state.branches, payload.branchId);
        item.product = findById(state.products, payload.productId);
        item.status = "IN_STOCK";
        state.movements.unshift({id: Date.now() + 1, type: "IMPORT", inventoryItem: item, product: item.product, toBranch: item.branch, quantity: 1, referenceCode: item.serialNumber, unitCost: item.costPrice, note: "Nhập kho"});
    }
    if (collection === "stocktakes") {
        item.branch = findById(state.branches, payload.branchId);
        item.product = findById(state.products, payload.productId);
        item.systemQuantity = state.inventory.filter(row => row.branch?.id === payload.branchId && row.product?.id === payload.productId && row.status === "IN_STOCK").length;
        item.differenceQuantity = item.actualQuantity - item.systemQuantity;
    }
    if (collection === "accounting") {
        item.voucherCode = `KT-${new Date().toISOString().slice(0, 19).replace(/\D/g, "")}`;
        item.branch = findById(state.branches, payload.branchId);
    }
    if (collection === "users") {
        item.branch = findById(state.branches, payload.branchId);
        replaceUserPermissions(item.id, defaultPermissionsForUser(item));
    }
    if (collection === "purchases") {
        item.purchaseCode = `PN-${new Date().toISOString().slice(0, 19).replace(/\D/g, "")}`;
        item.supplier = findOrCreateLocal(state.suppliers, payload.supplierName, name => ({id: Date.now() + 11, name, debtBalance: 0, active: true}));
        item.branch = findOrCreateLocal(state.branches, payload.branchName, name => ({id: Date.now() + 12, name, address: "Nhập tay", active: true}));
        item.items = payload.items.map(row => ({
            ...row,
            product: findOrCreateLocal(state.products, row.productName, name => ({id: Date.now() + 13, name, brand: "ChuanPhat", model: name, color: row.productColor, category: row.productCategory || "E_MOTORBIKE", price: row.unitCost})),
            lineTotal: row.quantity * row.unitCost
        }));
        item.total = item.items.reduce((sum, row) => sum + row.lineTotal, 0);
        item.status = "ORDERED";
    }
    if (collection === "serviceTickets") {
        item.ticketCode = `BH-${new Date().toISOString().slice(0, 19).replace(/\D/g, "")}`;
        item.branch = findById(state.branches, payload.branchId);
        item.customer = findById(state.customers, payload.customerId);
        item.inventoryItem = findById(state.inventory, payload.inventoryItemId);
    }
    state[collection].unshift ? state[collection].unshift(item) : state[collection].push(item);
}

function addAuthLog(actorName, actionName, description) {
    state.logs.unshift({
        id: Date.now(),
        actorName,
        moduleName: "AUTH",
        actionName,
        description,
        createdAt: new Date().toISOString()
    });
    render();
}

function fakeOrder(payload) {
    const branch = findById(state.branches, payload.branchId);
    const customer = findOrCreateCustomerLocal(payload.customerName, payload.customerPhone, payload.customerAddress);
    const inventory = findById(state.inventory, payload.items[0].inventoryItemId);
    inventory.status = "SOLD";
    const subtotal = Number(payload.items[0].unitPrice || 0);
    return {
        id: Date.now(),
        orderCode: `CP-${new Date().toISOString().slice(0,19).replace(/\D/g, "")}`,
        branch, customer,
        items: [{product: inventory.product, inventoryItem: inventory, quantity: 1, unitPrice: subtotal, lineTotal: subtotal}],
        subtotal, discount: payload.discount, tax: payload.tax, depositAmount: payload.depositAmount,
        total: subtotal - payload.discount + payload.tax, voucherCode: payload.voucherCode,
        paymentMethod: payload.paymentMethod, status: "PAID"
    };
}

function findOrCreateCustomerLocal(name, phone, address) {
    const cleanName = String(name || "").trim();
    const cleanPhone = String(phone || "").trim();
    let customer = state.customers.find(item => cleanPhone && String(item.phone || "").trim() === cleanPhone);
    if (!customer) {
        customer = state.customers.find(item => String(item.fullName || "").trim().toLowerCase() === cleanName.toLowerCase());
    }
    if (!customer) {
        customer = {
            id: Date.now() + 21,
            fullName: cleanName,
            phone: cleanPhone || "Chưa nhập",
            address,
            tier: "NEW",
            loyaltyPoints: 0,
            source: "POS"
        };
        state.customers.unshift(customer);
    }
    return customer;
}

function renderReceipt(order) {
    const items = order.items?.length ? order.items : [];
    const issueDate = receiptDate(new Date());
    const plainDate = receiptDate(new Date(), false);
    const subtotal = Number(order.subtotal || 0);
    const tax = Number(order.tax || 0);
    const total = Number(order.total || 0);
    document.getElementById("receipt-status").textContent = order.orderCode || "Đã tạo";
    document.getElementById("receipt-preview").innerHTML = `
        <div class="receipt-document">
            <div class="receipt-company">
                <strong>CÔNG TY TNHH LƯƠNG THỰC CHUẨN PHÁT</strong>
                <span>LK 02 Hưng Lộc Home, Số 389, Đường Lê Viết Thuật, Phường Vinh Lộc, Tỉnh Nghệ An, Việt Nam.</span>
            </div>
            <div class="receipt-title">
                <h2>PHIẾU XUẤT KHO KIÊM BẢO HÀNH</h2>
                <em>${issueDate}</em>
            </div>
            <div class="receipt-info">
                <div>
                    <p>- Họ và tên người mua hàng: <strong>${escapeHtml(order.customer?.fullName || "-")}</strong></p>
                    <p>- Tên khách hàng: <strong>${escapeHtml(order.customer?.fullName || "-")}</strong></p>
                    <p>- Địa chỉ: ${escapeHtml(order.customer?.address || order.branch?.address || "-")}</p>
                    <p>- Số điện thoại: ${escapeHtml(order.customer?.phone || "-")}</p>
                    <p>- Mã số thuế:</p>
                    <p>- Diễn giải: Thu tiền bán hàng ${escapeHtml(order.customer?.fullName || "")}</p>
                    <p>- Hình thức thanh toán: ${paymentText(order.paymentMethod)}</p>
                    <p>- Danh mục hàng hóa chi tiết như sau:</p>
                </div>
                <div>
                    <p>Số: <strong>${escapeHtml(order.orderCode || "-")}</strong></p>
                    <p>Loại tiền: VND</p>
                </div>
            </div>
            <table class="receipt-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã hàng</th>
                        <th>Tên hàng</th>
                        <th>ĐVT</th>
                        <th>Thời hạn bảo hành</th>
                        <th>Mã quy cách</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map((row, index) => receiptItemRow(row, index)).join("")}
                </tbody>
                <tfoot>
                    <tr><td colspan="8">Cộng tiền hàng</td><td>${numberMoney(subtotal)}</td></tr>
                    <tr><td colspan="4">Thuế suất GTGT:</td><td colspan="4">Tiền thuế GTGT:</td><td>${numberMoney(tax)}</td></tr>
                    <tr><td colspan="8">Tổng tiền thanh toán</td><td>${numberMoney(total)}</td></tr>
                </tfoot>
            </table>
            <p class="receipt-words">Số tiền bằng chữ: <strong><em>${capitalizeFirst(numberToVietnameseWords(total))} đồng.</em></strong></p>
            <p>Số chứng từ gốc kèm theo:</p>
            <div class="receipt-sign-date">${plainDate}</div>
            <div class="receipt-signatures">
                <div><strong>Thủ kho</strong><span>(Ký, họ tên)</span></div>
                <div><strong>Người giao hàng</strong><span>(Ký, họ tên)</span></div>
                <div><strong>Người nhận hàng</strong><span>(Ký, họ tên)</span></div>
                <div><strong>Kinh doanh</strong><span>(Ký, họ tên)</span></div>
            </div>
        </div>
    `;
}

function receiptItemRow(row, index) {
    const product = row.product || {};
    const inventory = row.inventoryItem || {};
    const quantity = Number(row.quantity || 1);
    const unitPrice = Number(row.unitPrice || product.price || 0);
    const lineTotal = Number(row.lineTotal || unitPrice * quantity);
    const itemCode = inventory.vehicleCode || product.qrCode || product.id || "-";
    const warranty = product.warrantyMonths ? `${product.warrantyMonths} tháng` : "";
    const spec = [product.color, inventory.serialNumber || inventory.imei].filter(Boolean).join(" - ");
    return `
        <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(itemCode)}</td>
            <td>${escapeHtml(product.name || "-")}</td>
            <td>Chiếc</td>
            <td>${escapeHtml(warranty)}</td>
            <td>${escapeHtml(spec)}</td>
            <td>${quantity.toLocaleString("vi-VN", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td>${numberMoney(unitPrice)}</td>
            <td>${numberMoney(lineTotal)}</td>
        </tr>
    `;
}

function receiptDate(date, withDayWord = true) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return withDayWord ? `Ngày ${day} tháng ${month} năm ${year}` : `Ngày ${day} tháng ${month} năm ${year}`;
}

function numberMoney(value) {
    return Number(value || 0).toLocaleString("vi-VN");
}

function capitalizeFirst(value) {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}

function numberToVietnameseWords(value) {
    const amount = Math.round(Number(value || 0));
    if (amount === 0) return "không";
    const units = ["", "nghìn", "triệu", "tỷ"];
    const parts = [];
    let remaining = amount;
    let unitIndex = 0;
    while (remaining > 0 && unitIndex < units.length) {
        const group = remaining % 1000;
        if (group > 0) {
            parts.unshift(`${readThreeDigits(group, remaining >= 1000)} ${units[unitIndex]}`.trim());
        }
        remaining = Math.floor(remaining / 1000);
        unitIndex += 1;
    }
    return parts.join(" ").replace(/\s+/g, " ").trim();
}

function readThreeDigits(number, full) {
    const digitWords = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    const hundred = Math.floor(number / 100);
    const ten = Math.floor((number % 100) / 10);
    const one = number % 10;
    const words = [];
    if (hundred > 0 || full) {
        words.push(`${digitWords[hundred]} trăm`);
    }
    if (ten > 1) {
        words.push(`${digitWords[ten]} mươi`);
        if (one === 1) words.push("mốt");
        else if (one === 5) words.push("lăm");
        else if (one > 0) words.push(digitWords[one]);
    } else if (ten === 1) {
        words.push("mười");
        if (one === 5) words.push("lăm");
        else if (one > 0) words.push(digitWords[one]);
    } else if (one > 0) {
        if (hundred > 0 || full) words.push("linh");
        words.push(one === 5 && (hundred > 0 || full) ? "năm" : digitWords[one]);
    }
    return words.join(" ");
}

function calculateVoucherDiscount(code, subtotal) {
    const voucher = state.vouchers.find(item => item.code === code);
    if (!voucher || subtotal < Number(voucher.minOrderValue || 0)) return 0;
    if (voucher.type === "PERCENTAGE") return Math.round(subtotal * Number(voucher.value || 0) / 100);
    return Number(voucher.value || 0);
}

function sumAccounting(type) {
    return state.accounting.filter(item => item.type === type).reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

function findById(items, id) {
    return items.find(item => item.id === Number(id)) || null;
}

function findOrCreateLocal(items, name, createFn) {
    const normalized = String(name || "").trim().toLowerCase();
    let item = items.find(row => String(row.name || "").trim().toLowerCase() === normalized);
    if (!item) {
        item = createFn(String(name || "").trim());
        items.push(item);
    }
    return item;
}

function setStatus(online) {
    const status = document.getElementById("api-status");
    status.className = `status ${online ? "online" : "offline"}`;
    status.textContent = online ? "API: đã kết nối" : "API: dùng dữ liệu mẫu";
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.add("hidden"), 2600);
}

function emptyRow() {
    return `<div class="table-row" style="grid-template-columns:1fr"><span class="muted">Chưa có dữ liệu</span></div>`;
}

function cell(value) {
    if (value && typeof value === "object" && "__html" in value) {
        return `<span>${value.__html}</span>`;
    }
    return `<span>${escapeHtml(String(value ?? ""))}</span>`;
}

function rawCell(html) {
    return {__html: html};
}

function escapeHtml(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function filterAny(items, query) {
    if (!query) return items;
    return items.filter(item => JSON.stringify(item).toLowerCase().includes(query));
}

function countBy(items, keyFn) {
    return items.reduce((acc, item) => {
        const key = keyFn(item);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
}

function numberOrNull(value) {
    return value === "" || value == null ? null : Number(value);
}

function money(value) {
    return Number(value || 0).toLocaleString("vi-VN") + " đ";
}

function formatDateTime(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("vi-VN");
}

function categoryText(value) {
    return {E_MOTORBIKE: "Xe máy điện", E_BICYCLE: "Xe đạp điện", FIFTY_CC: "Xe máy 50cc", ACCESSORY: "Phụ kiện"}[value] || value || "-";
}

function statusText(value) {
    return {IN_STOCK: "Còn kho", SOLD: "Đã bán", TRANSFERRED: "Đã chuyển", REPAIRING: "Đang sửa", RESERVED: "Đã giữ", NEW: "Mới", ASSIGNED: "Đang xử lý", CLOSED: "Đã đóng", PAID: "Đã thanh toán"}[value] || value || "-";
}

function tierText(value) {
    return {NEW: "Mới", POTENTIAL: "Tiềm năng", VIP: "VIP"}[value] || value || "-";
}

function channelText(value) {
    return {ZALO_OA: "Zalo OA", FACEBOOK: "Facebook", TIKTOK: "TikTok"}[value] || value || "-";
}

function paymentText(value) {
    return {CASH: "Tiền mặt", BANK_TRANSFER: "Chuyển khoản", QR_BANKING: "QR Banking", EWALLET: "Ví điện tử", INSTALLMENT: "Trả góp"}[value] || value || "-";
}

function accountingTypeText(value) {
    return {INCOME: "Thu tiền", EXPENSE: "Chi tiền", RECEIVABLE: "Phải thu", PAYABLE: "Phải trả", TRANSFER: "Chuyển quỹ"}[value] || value || "-";
}

function roleText(value) {
    return {ADMIN: "Admin", ACCOUNTANT: "Kế toán", CASHIER: "Thu ngân", BRANCH_MANAGER: "Quản lý chi nhánh", SALES: "Bán hàng", SERVICE: "Dịch vụ"}[value] || value || "-";
}

function movementText(value) {
    return {IMPORT: "Nhập kho", EXPORT: "Xuất kho", TRANSFER: "Chuyển kho", SALE: "Bán hàng", STOCKTAKE_ADJUST: "Điều chỉnh kiểm kê", RETURN: "Trả hàng"}[value] || value || "-";
}

function purchaseStatusText(value) {
    return {DRAFT: "Nháp", ORDERED: "Đã đặt", PARTIAL: "Một phần", RECEIVED: "Đã nhận", CANCELLED: "Đã hủy"}[value] || value || "-";
}

function serviceStatusText(value) {
    return {RECEIVED: "Tiếp nhận", DIAGNOSING: "Kiểm tra", WAITING_PARTS: "Chờ linh kiện", REPAIRING: "Đang sửa", COMPLETED: "Hoàn tất", RETURNED: "Đã trả xe"}[value] || value || "-";
}

function voucherTypeText(value) {
    return {FIXED_AMOUNT: "Giảm tiền", PERCENTAGE: "Giảm %"}[value] || value || "-";
}

const savedSession = localStorage.getItem(SESSION_KEY);
if (savedSession) {
    try {
        unlockApp(JSON.parse(savedSession));
    } catch {
        localStorage.removeItem(SESSION_KEY);
    }
}

loadData(false);
