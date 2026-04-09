# 1. 빌드 환경 (Gradle 기준)
FROM gradle:8.5-jdk17 AS build
WORKDIR /app
COPY build.gradle settings.gradle ./
RUN gradle dependencies --no-daemon 
COPY src ./src
RUN gradle clean build -x test --no-daemon

# 2. 실행 환경
FROM amazoncorretto:17-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]