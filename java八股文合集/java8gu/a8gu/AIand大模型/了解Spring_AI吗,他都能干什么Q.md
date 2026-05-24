# ✅了解Spring AI吗，他都能干什么？

# 典型回答

Spring ai是Spring官方推出的ai应用开发框架，最近（2025年5月20）刚刚发布1.0版本，他的主要作用就是通过提供各种API的封装来降低用Java开发大模型应用的门槛。

#### 与大型语言模型集成Spring通过简单的配置快速集成 OpenAI、Azure OpenAI、HuggingFace、Ollama、Mistral、Google Gemini 等主流 LLM 服务。

#### 提供了ChatClient和ChatModel和大模型进行对话

ChatModel API 让应用开发者可以非常方便的与 AI 模型进行文本交互，它抽象了应用与模型交互的过程，包括使用 `Prompt` 作为输入，使用 `ChatResponse` 作为输出等。
​

`ChatClient` 提供了与 AI 模型通信的 Fluent API，它支持同步和反应式（Reactive）编程模型。与 `ChatModel`、`Message`、`ChatMemory` 等原子 API 相比，更加灵活，代码更精简。
​

#### ​Prompt 模板支持可以定义 prompt 模板，使用变量动态生成 prompt。使用类似 Spring Boot 配置和注入方式加载模板。
​

#### 支持RAG支持将文本向量化后存储到向量数据库（如 Redis, Pinecone, PostgreSQL with pgvector, Milvus 等）。可用于构建 RAG 应用，实现文档问答、知识库问答等。

#### 支持对话记忆

支持基于chat memory的对话记忆，也就是不需要调用显示的记录每一轮的对话历史。
​

​

​

#### 支持Function Calling

官方文档：[https://docs.spring.io/spring-ai/reference/api/tools.html](https://docs.spring.io/spring-ai/reference/api/tools.html)
​

#### 支持MCP

官方文档：[https://docs.spring.io/spring-ai/reference/api/mcp/mcp-overview.html](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-overview.html)
