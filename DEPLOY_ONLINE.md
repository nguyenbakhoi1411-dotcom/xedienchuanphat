# Deploy ChuanPhat Online

Muc tieu: chay ChuanPhat bang mot link online, khong dung `localhost`.

## Cach don gian nhat

Dung 1 VPS Windows/Linux hoac cloud server co:

- Java 17
- SQL Server online hoac SQL Server tren VPS
- Port public, domain neu co

## Bien moi truong can cau hinh

Backend da doc cau hinh tu bien moi truong:

```text
PORT=9998
DB_URL=jdbc:sqlserver://YOUR_SQL_HOST:1433;databaseName=ev_showroom;encrypt=true;trustServerCertificate=true
DB_USERNAME=ev_user
DB_PASSWORD=EvShowroom@123
APP_CORS_ALLOWED_ORIGIN=https://your-domain.com
```

Neu chua co domain, co the de:

```text
APP_CORS_ALLOWED_ORIGIN=*
```

## Tao database online

Trong SQL Server Management Studio, ket noi toi SQL Server online roi chay:

```text
database/ev_showroom_sqlserver.sql
database/create_sqlserver_user.sql
database/add_accounting_module.sql
```

## Build file JAR

```bash
cd backend
mvn -DskipTests package
```

File chay:

```text
backend/target/ev-showroom-backend-0.0.1-SNAPSHOT.jar
```

## Chay online tren server

```bash
java -jar backend/target/ev-showroom-backend-0.0.1-SNAPSHOT.jar
```

Mo:

```text
http://SERVER_IP:9998
```

Neu gan domain, tro domain ve server va cau hinh reverse proxy HTTPS.

## Chay bang Docker

Build image tu thu muc goc project:

```bash
docker build -t chuanphat .
```

Run:

```bash
docker run -p 9998:9998 ^
  -e DB_URL="jdbc:sqlserver://YOUR_SQL_HOST:1433;databaseName=ev_showroom;encrypt=true;trustServerCertificate=true" ^
  -e DB_USERNAME="ev_user" ^
  -e DB_PASSWORD="EvShowroom@123" ^
  chuanphat
```

Sau do mo:

```text
http://SERVER_IP:9998
```

