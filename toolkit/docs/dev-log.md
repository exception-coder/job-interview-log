# Dev Log

## 2026-03-18 重构：拆分 bootstrap 为 api 和 starter 模块

### 变更内容

- 拆分 `toolkit-bootstrap` 为两个独立模块：
  - `toolkit-api`：接口层，包含所有 REST Controller
  - `toolkit-starter`：启动层，包含 Spring Boot 配置、Application 启动类和独立 Runner
- 依赖关系：`starter` 依赖 `api` + `infrastructure`，`api` 依赖 `application` + `domain`
- 迁移文件：
  - Controller → `toolkit-api/src/main/java/com/kai/toolkit/api/controller/`
  - Config + Application + Runner → `toolkit-starter/src/main/java/com/kai/toolkit/starter/`
- 删除旧的 `toolkit-bootstrap` 模块

### 涉及文件

- `toolkit-api/build.gradle.kts` — 新增
- `toolkit-api/.../controller/KnowledgeController.java` — 从 bootstrap 迁移
- `toolkit-starter/build.gradle.kts` — 新增
- `toolkit-starter/.../ToolkitApplication.java` — 从 bootstrap 迁移
- `toolkit-starter/.../config/HttpConfig.java` — 从 bootstrap 迁移
- `toolkit-starter/.../config/FileConfig.java` — 从 bootstrap 迁移
- `toolkit-starter/.../config/KnowledgeConfig.java` — 从 bootstrap 迁移
- `toolkit-starter/.../UrlDecodeRunner.java` — 从 bootstrap 迁移
- `toolkit-starter/src/main/resources/application.yml` — 从 bootstrap 复制
- `settings.gradle.kts` — 更新模块列表
- `toolkit-bootstrap/` — 删除

### 架构优势

- **职责分离**：API 层只管接口定义，Starter 层只管组装和启动
- **复用性提升**：`toolkit-api` 可作为 SDK 单独依赖，供其他项目使用
- **测试隔离**：API 层可独立进行集成测试，无需启动完整 Spring 容器
- **扩展性增强**：未来可轻松添加 gRPC、MQ 等其他接入方式

### 备注

- 启动命令改为：`./gradlew :toolkit-starter:bootRun`
- 模块数量从 4 个增加到 5 个（domain/application/infrastructure/api/starter）

---

## 2026-03-18 新增知识点查询接口（knowledge 模块）

### 变更内容

- 新增 knowledge 模块：提供知识点目录树和 Markdown 内容查询功能
- Domain 层：定义 `KnowledgeNode`（目录树节点）、`KnowledgeContent`（内容）、`KnowledgeRepositoryPort`（仓储接口）
- Application 层：实现 `KnowledgeQueryService`，提供目录树查询和路径规范化
- Infrastructure 层：实现 `FileSystemKnowledgeRepository`，递归遍历文件系统构建目录树，读取 Markdown 文件
- Bootstrap 层：新增 `KnowledgeController` REST API 和 `KnowledgeConfig` Bean 配置
- 配置项：`toolkit.knowledge.root-path` 指定知识根目录路径

### 涉及文件

- `toolkit-domain/.../knowledge/model/KnowledgeNode.java` — 新增
- `toolkit-domain/.../knowledge/model/KnowledgeContent.java` — 新增
- `toolkit-domain/.../knowledge/port/KnowledgeRepositoryPort.java` — 新增
- `toolkit-application/.../knowledge/KnowledgeQueryService.java` — 新增
- `toolkit-infrastructure/.../knowledge/FileSystemKnowledgeRepository.java` — 新增
- `toolkit-infrastructure/.../knowledge/FileSystemKnowledgeRepositoryTest.java` — 新增（5 个测试）
- `toolkit-bootstrap/.../controller/KnowledgeController.java` — 新增
- `toolkit-bootstrap/.../config/KnowledgeConfig.java` — 新增
- `toolkit-bootstrap/src/main/resources/application.yml` — 新增 knowledge 配置

### API 端点

- `GET /api/knowledge/tree` — 获取完整知识点目录树
- `GET /api/knowledge/content?path={相对路径}` — 获取指定路径的 Markdown 内容

### 备注

- 目录树递归构建，仅包含 `.md` 文件，忽略其他文件类型
- 路径参数自动规范化（移除前导斜杠）
- 文件不存在时返回 404

---

## 2026-03-17 新增流式解码适配器与单元测试

### 变更内容

- 新增 `StreamingUrlDecodeAdapter`：流式处理超大文件，堆内仅保留一个 256KB 块，解决 `%XX` 跨块边界问题
- 重构 `NioUrlDecodeAdapter`：去掉无意义的 NIO 分块拼接，改用 `Files.readString()` 简化实现
- 补充两个适配器的完整单元测试，覆盖正常、边界、异常路径
- 更新 rules：新增「每个功能类必须有对应单元测试」规范

### 涉及文件

- `toolkit-infrastructure/.../file/StreamingUrlDecodeAdapter.java` — 新增
- `toolkit-infrastructure/.../file/NioUrlDecodeAdapter.java` — 重构
- `toolkit-infrastructure/.../file/NioUrlDecodeAdapterTest.java` — 新增（6 个测试）
- `toolkit-infrastructure/.../file/StreamingUrlDecodeAdapterTest.java` — 新增（6 个测试）
- `toolkit-infrastructure/build.gradle.kts` — 补充 jackson-datatype-jsr310 依赖
- `.cursor/rules/toolkit-architecture.mdc` — 测试规范补充强制要求

### 备注

- 两个适配器适用场景不同：`NioUrlDecodeAdapter` 适合中小文件（支持 prettyPrint），`StreamingUrlDecodeAdapter` 适合超大文件（输出必须写文件）
- 流式方案关键：每块末尾检查 `%` 或 `%X` 残留，留到下一块头部拼接后再解码

---

## 2026-03-17 新增 URL 解码工具（file 模块）

### 变更内容

- 新增 `file` 工具包，支持高效读取并 URL 解码大文件（NIO FileChannel 分块读取）
- 解码后自动 JSON 格式化输出（非 JSON 内容原样返回）
- 新增 Gradle task `decodeFile`，可直接命令行调用
- 实测：765KB URL 编码文件解码耗时 137ms，输出格式化 JSON

### 用法

```bash
./gradlew :toolkit-bootstrap:decodeFile \
  "-PinputFile=<input.txt>" \
  "-PoutputFile=<output.json>"
```

### 涉及文件

- `toolkit-domain/.../domain/file/model/DecodeRequest.java`
- `toolkit-domain/.../domain/file/model/DecodeResult.java`
- `toolkit-domain/.../domain/file/port/UrlDecodePort.java`
- `toolkit-application/.../application/file/UrlDecodeService.java`
- `toolkit-infrastructure/.../infrastructure/file/NioUrlDecodeAdapter.java`
- `toolkit-bootstrap/.../config/FileConfig.java`
- `toolkit-bootstrap/.../UrlDecodeRunner.java`
- `toolkit-bootstrap/build.gradle.kts` — 新增 `decodeFile` task

### 备注

- NioUrlDecodeAdapter 使用 256KB DirectByteBuffer 分块读取，适合大文件
- ObjectMapper 注册 JavaTimeModule，支持 Java 8 时间类型序列化

---

## 2026-03-17 初始化 toolkit 项目

### 变更内容

- 基于 DDD Lite 架构搭建 Java 21 + Gradle 多模块项目
- 实现首期 HTTP/爬虫工具模块
- 配置 Cursor Rules 和 CLAUDE.md 编码规范

### 涉及文件

- `gradle/libs.versions.toml` — 统一版本管理
- `settings.gradle.kts` / `build.gradle.kts` — 根项目配置
- `toolkit-domain/.../domain/shared/Result.java` — 通用结果封装
- `toolkit-domain/.../domain/http/model/HttpRequest.java`
- `toolkit-domain/.../domain/http/model/HttpResponse.java`
- `toolkit-domain/.../domain/http/model/CrawlResult.java`
- `toolkit-domain/.../domain/http/port/HttpClientPort.java`
- `toolkit-application/.../application/http/CrawlService.java`
- `toolkit-application/.../application/http/HtmlParserPort.java`
- `toolkit-application/.../application/http/ParsedHtml.java`
- `toolkit-infrastructure/.../infrastructure/http/OkHttpClientAdapter.java`
- `toolkit-infrastructure/.../infrastructure/http/JsoupHtmlParser.java`
- `toolkit-bootstrap/.../ToolkitApplication.java`
- `toolkit-bootstrap/.../config/HttpConfig.java`
- `toolkit-bootstrap/.../resources/application.yml`
- `.cursor/rules/toolkit-architecture.mdc` — Cursor 编码规范
- `CLAUDE.md` — Claude 上下文规范

### 备注

- 依赖方向：bootstrap → infrastructure → application → domain
- infrastructure 模块需同时依赖 domain 和 application 以实现双层 Port
- 单元测试 3 个全部通过（`CrawlServiceTest`）
