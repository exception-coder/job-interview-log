import org.gradle.api.tasks.testing.logging.TestExceptionFormat

plugins {
    alias(libs.plugins.spring.boot) apply false
    alias(libs.plugins.spring.dependency.management) apply false
}

subprojects {
    apply(plugin = "java")

    group = "com.kai.toolkit"
    version = "1.0.0-SNAPSHOT"

    configure<JavaPluginExtension> {
        toolchain {
            languageVersion.set(JavaLanguageVersion.of(21))
        }
    }

    repositories {
        maven { url = uri("https://maven.aliyun.com/repository/public") }
        mavenCentral()
    }

    dependencies {
        val lombok = rootProject.libs.lombok
        "compileOnly"(lombok)
        "annotationProcessor"(lombok)
        "testCompileOnly"(lombok)
        "testAnnotationProcessor"(lombok)

        "testImplementation"(rootProject.libs.junit.api)
        "testRuntimeOnly"(rootProject.libs.junit.engine)
        "testImplementation"(rootProject.libs.mockito.core)
        "testImplementation"(rootProject.libs.mockito.junit)
    }

    tasks.withType<Test> {
        useJUnitPlatform()
        testLogging {
            exceptionFormat = TestExceptionFormat.FULL
            showStandardStreams = true
        }
    }
}
