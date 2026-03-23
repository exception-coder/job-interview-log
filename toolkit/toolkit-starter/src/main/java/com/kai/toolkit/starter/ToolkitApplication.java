package com.kai.toolkit.starter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Toolkit 应用启动类
 */
@SpringBootApplication(scanBasePackages = "com.kai.toolkit")
public class ToolkitApplication {

    public static void main(String[] args) {
        SpringApplication.run(ToolkitApplication.class, args);
    }
}
