FROM eclipse-temurin:21-jdk
WORKDIR /app
ARG JAR_FILE=target/centromasajes-0.0.1.jar
COPY ${JAR_FILE} app_centromasajes.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app_centromasajes.jar"]