# Toolkit - Java 工具库项目

## 项目概览

Java 21 + Gradle 多模块项目，采用 DDD Lite 架构，用于积累各类工具包和脚本。首期模块：HTTP/爬虫工具。

## 模块结构

```
toolkit/
├── toolkit-domain/        # 领域层：纯 POJO + Port 接口，零框架依赖
├── toolkit-application/   # 应用层：用例 Service，依赖 domain 接口
├── toolkit-infrastructure/ # 基础设施层：实现 Port（OkHttp、Jsoup）
├── toolkit-api/           # 接口层：REST Controller，依赖 application
└── toolkit-starter/       # 启动层：Spring Boot Config + Application，组装所有 Bean
```

## 关键约定

- **依赖方向**：starter → (api + infrastructure) → application → domain
- **职责分离**：api 只管接口定义，starter 只管组装和启动
- **返回值**：Service 方法统一返回 `Result<T>`，不抛受检异常
- **Port 命名**：出站接口统一以 `Port` 结尾
- **测试**：application 层用 Mockito mock，禁止真实网络请求
- **注释**：每个类和 public 方法必须有 Javadoc；方法内每个逻辑块写单行注释说明目的

## 常用命令

```bash
# 编译
./gradlew compileJava

# 运行测试
./gradlew test

# 运行特定模块测试
./gradlew :toolkit-application:test --rerun

# 启动应用
./gradlew :toolkit-starter:bootRun

# 构建全量 jar
./gradlew build
```

## 新增工具包流程

1. `toolkit-domain` 新建 `{feature}/model/` 和 `{feature}/port/`
2. `toolkit-application` 新建 `{feature}/` 写 Service
3. `toolkit-infrastructure` 实现 Port 接口
4. `toolkit-api` 新建 Controller（如需暴露 REST API）
5. `toolkit-starter/config/` 注册 Spring Bean
6. `gradle/libs.versions.toml` 添加新依赖
7. 在 `docs/dev-log.md` 顶部追加本次开发记录

## 开发日志规范

每次开发完成后记录到 `docs/dev-log.md`，不存在则创建。内容**倒序**，最新在最上方。

格式：

```markdown
## YYYY-MM-DD 简短标题

### 变更内容
- 做了什么

### 涉及文件
- `模块/路径/文件.java`

### 备注
（可选）
```

## 技术栈

| 项目 | 版本 |
|------|------|
| Java | 21 |
| Spring Boot | 3.3.4 |
| OkHttp | 4.12.0 |
| Jsoup | 1.18.1 |
| Lombok | 1.18.34 |
| JUnit | 5.11.0 |
| Mockito | 5.12.0 |
