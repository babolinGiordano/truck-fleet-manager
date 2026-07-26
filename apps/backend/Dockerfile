# syntax=docker/dockerfile:1

# ---------- stage 1: build ----------
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /build

# pom prima dei sorgenti: le dipendenze restano in cache tra i build
COPY pom.xml ./
RUN mvn -B -ntp dependency:go-offline

COPY src ./src
RUN mvn -B -ntp package -DskipTests

# ---------- stage 2: runtime ----------
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app
RUN addgroup -S spring && adduser -S spring -G spring

# artifactId + version dal pom: truck-fleet-backend-0.0.1-SNAPSHOT
COPY --from=build /build/target/truck-fleet-backend-0.0.1-SNAPSHOT.jar app.jar

USER spring
EXPOSE 3000

# MaxRAMPercentage: la JVM rispetta il limite di memoria del container
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "/app/app.jar"]
