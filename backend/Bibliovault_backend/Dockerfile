# Stage 1: Build stage
FROM openjdk:11-jdk-slim AS build

WORKDIR /app

# Copy Gradle wrapper and build files first
COPY gradlew .
COPY gradle gradle/
COPY build.gradle .
COPY settings.gradle .

# Make gradlew executable
RUN chmod +x ./gradlew

# Download dependencies
RUN ./gradlew dependencies --no-daemon

# Copy source code
COPY src ./src

# Build the application
RUN ./gradlew build -x test --no-daemon

# Stage 2: Runtime stage
FROM openjdk:11-jre-slim

# Create non-root user for security
RUN groupadd --system --gid 1000 spring && \
    useradd --system --uid 1000 --gid spring --shell /bin/false spring

WORKDIR /app

# Copy the JAR file from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Change ownership to spring user
RUN chown spring:spring /app/app.jar

# Switch to non-root user
USER spring

# Expose the port that Render will assign (typically 10000)
EXPOSE 10000

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
