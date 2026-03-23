plugins {
    id("java")
}

dependencies {
    implementation(project(":toolkit-domain"))
    implementation(project(":toolkit-application"))
    implementation(libs.okhttp)
    implementation(libs.okhttp.logging)
    implementation(libs.jsoup)
    implementation(libs.jackson.databind)
    implementation(libs.jackson.datatype.jsr310)
    implementation(libs.spring.boot.starter)
}
