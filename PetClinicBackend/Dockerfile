# Use official Java 21 image from Eclipse Temurin
FROM eclipse-temurin:21-jdk

# Set working directory
WORKDIR /app

# Copy Spring Boot JAR
COPY target/PetClinicBackend-0.0.1-SNAPSHOT.jar app.jar

# Expose app port
EXPOSE 8080

# Run app
ENTRYPOINT ["java", "-jar", "app.jar"]
