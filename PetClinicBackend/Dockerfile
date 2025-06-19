# Use an official JDK image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the Spring Boot JAR into the container
COPY target/PetClinicBackend-0.0.1-SNAPSHOT.jar app.jar

# Expose port (match your `application.properties`)
EXPOSE 8080

# Start the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
