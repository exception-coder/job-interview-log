# ✅在Java项目中集成大模型，用什么框架？

# 典型回答在Java应用中想要集成LLM，一般有以下几个选择：
​

1、自己手撕，直接调用API
2、使用Spring AI
3、使用LangChain4j
4、使用Spring AI Alibaba
5、使用agentscope-java
​

首先第一个肯定不建议，因为LLM开发的话，一般不仅需要对接模型，还需要做对话记忆、工具调用、RAG等等的，这些如果要自己对接模型API的话，都要从头写一遍，成本太高了。
​

另外几个框架，Spring AI是比较基础的一个框架，是Spring官方的一个LLM集成框架，但是他的功能非常有限，只有简单的chatMode、ChatClient等基础封装。适合做一些简单的项目使用。
​

LangChain4j是一个对标Python中的LangChain的框架，但是功能肯定不如LangChain，很多功能都是阉割的，但是他在RAG这方面的支持，比Spring AI要强得的多。如果你想在Java中做一个rag，建议使用LangChain4j
​

如果你要做Agent开发，尤其是多智能体、复杂的Agent的话，建议使用Spring AI Alibaba或者agentscope-java，这两个都是alibaba推出的智能体框架，方便java开发者构建智能体的，主要区别是Spring AI Alibaba是基于Spring AI做的扩展，主要是为了完善spring ai的能力。agentscope是致力于做智能体搭建的。
​

以下是我的[AI实战课](https://www.yuque.com/hollis666/fsn3og/dkm70gxmurvgph0z)中给大家做的简单总结（暂不包含agentscope）：

|  |  |  |  |
| **能力** | **LangChain4j** | **Spring AI** | **Spring AI Alibaba** |
| **是否依赖 Spring** | ❌ 可独立使用 | ✔️ 深度集成 | ✔️ 深度集成 |
| **模型调用复杂度** | ✔️ 支持高层次API，快速实现LLM调用 | ❌只支持ChatModel和ChatClient | ✔️ 除Spring AI功能外，有更多增强API |
| **结构化输出** | ✔️ 强（JSON Schema） | ✔️ 基础支持 | ✔️ 增强版 |
| **RAG 支持** | ✔️ 全链路 | ✔️ 基础 | ✔️ 企业级增强 |
| **智能体（Agent）** | ❌ 需手动实现 | ❌ 需手动实现 | ✔️ 基于Graph实现了ReAct，支持 Multi-Agent等。 |
| **工作流编排** | ⚠️ 简单 Chain | ❌ 无 | ✔️ Graph 引擎（核心优势） |
| **阿里云集成** | ✔️ Qwen/DashScope | ❌ 无官方支持 | ✔️ 深度集成（百炼、OSS、Nacos） |
| **生产可观测性** | ⚠️ 需自行集成 | ✔️ Micrometer | ✔️ ARMS/SLS 原生 |
| **生态依赖** | ✔️ 我依赖要求 | ✔️ 我依赖要求 | ⚠️依赖阿里百炼 |

**非 Spring/或者Spring Boot版本低于3.0，纯Java项目项目**→ 选 **LangChain4j**

**需要快速原型验证，且熟悉 LangChain 概念 **→ 选 **LangChain4j**

**已有 Spring Boot 项目，只需简单 LLM 调用**→ 选 **Spring AI**

**构建企业级RAG****→ 选LangChain4j**

**构建企业级、多步骤、多角色协作的 AI 应用/Agent** → 选 **Spring AI Alibaba**

**想用 Java 但又想要接近 Python LangChain 的体验** → **LangChain4j 是最佳选择**
