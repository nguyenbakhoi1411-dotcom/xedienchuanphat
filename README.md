# ChuanPhat Management

Phan mem quan ly offline cho chuoi showroom xe dien, xe may 50cc ChuanPhat.

## Cong nghe

- Backend: Java 17, Spring Boot 3, Maven
- Frontend: HTML, CSS, JavaScript
- Database: SQL Server
- IDE: NetBeans
- Backend port: `9998`

## Module da co trong ban offline

- Dang nhap, quan ly nguoi dung, vai tro va nhat ky hoat dong
- Quan ly chi nhanh
- Quan ly san pham, QR/mau sac/bao hanh
- Quan ly kho serial/IMEI, nhap kho, chuyen kho, lich su kho, kiem ke
- Ban hang/POS, voucher, dat coc, QR Banking, vi dien tu, tra gop
- Ke toan thu chi, cong no, so quy, tai khoan ke toan
- CRM khach hang, diem tich luy, hang thanh vien
- Bao hanh va sua chua
- Nha cung cap, don nhap hang, cong no NCC
- Bao cao doanh thu, loi nhuan tam tinh, ton kho, cong no
- Man hinh roadmap AI va tich hop Zalo OA/Facebook/TikTok/VNPay/Momo/VietQR

## Cau truc

```text
backend/   Source code Java Spring Boot
database/  File SQL Server
frontend/  Giao dien HTML
```

## Tao database moi

Mo file sau bang SQL Server Management Studio va bam Execute:

```text
database/ev_showroom_sqlserver.sql
```

File nay se tao lai database mau `ev_showroom` va co the xoa du lieu cu neu da ton tai bang.

## Nang cap database cu khong xoa du lieu

Neu anh da tao DB tu truoc, chay file nay truoc khi Run lai app:

```text
database/offline_full_modules_update.sql
```

Sau do neu chua co user SQL Server cho app thi chay tiep:

```text
database/create_sqlserver_user.sql
```

## Tai khoan dang nhap mau

```text
Tai khoan: admin
Mat khau: 123456
```

Khi mo `http://localhost:9998`, he thong se hien man hinh dang nhap truoc. Neu trinh duyet da luu phien dang nhap cu, bam `Dang xuat` tren thanh tren cung de quay lai man hinh login.

## Cau hinh SQL Server

Mac dinh backend dung user:

```properties
spring.datasource.username=ev_user
spring.datasource.password=EvShowroom@123
```

Neu dung SQL Server Express, co the doi URL trong `backend/src/main/resources/application.properties` thanh:

```properties
spring.datasource.url=jdbc:sqlserver://localhost\\SQLEXPRESS;databaseName=ev_showroom;encrypt=true;trustServerCertificate=true
```

## Mo backend bang NetBeans

1. File > Open Project
2. Chon thu muc `backend`
3. Doi NetBeans tai Maven dependencies
4. Run class `com.evshowroom.EvShowroomApplication`

Backend chay tai:

```text
http://localhost:9998
```

Neu bao port 9998 dang duoc dung, dung tien trinh Java cu hoac doi port trong `application.properties`.

## Mo giao dien

Sau khi backend chay thanh cong, mo:

```text
http://localhost:9998
```

Spring Boot se tu dieu huong toi giao dien trong `frontend/index.html`.

## Chay online sau nay

Project da san sang de deploy online bang file JAR hoac Docker. Xem:

```text
DEPLOY_ONLINE.md
```
