plugins {
    id("java")
    id("org.springframework.boot") version "3.3.4"
    id("io.spring.dependency-management") version "1.1.6"
}

group = "com.kai.toolkit"
version = "1.0-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // 依赖 api 和 infrastructure 层
    implementation(project(":toolkit-api"))
    implementation(project(":toolkit-infrastructure"))

    // 需要直接依赖 domain 和 application（用于 Runner 和 Config）
    implementation(project(":toolkit-domain"))
    implementation(project(":toolkit-application"))

    // Spring Boot Starter
    implementation("org.springframework.boot:spring-boot-starter-web")

    // Jackson（用于 Runner）
    implementation("com.fasterxml.jackson.core:jackson-databind")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")

    // Lombok
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
}

tasks.test {
    useJUnitPlatform()
}
