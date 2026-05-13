FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY backend ./backend
COPY frontend ./frontend
RUN cd backend && mvn -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/backend/target/ev-showroom-backend-0.0.1-SNAPSHOT.jar app.jar
ENV PORT=9998
EXPOSE 9998
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

