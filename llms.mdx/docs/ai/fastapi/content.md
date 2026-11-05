# 概览 (/docs/ai/fastapi)

FastAPI 是一个现代、快速（高性能）的 Python Web 框架，基于标准的 Python 类型提示（Type Hints），底层由 **Starlette**（负责高性能 ASGI 异步核心）和 **Pydantic**（负责数据验证与序列化）强力驱动。在现代人工智能（AI）、大语言模型（LLM）微服务、智能体（Agent）开发领域，FastAPI 已成为事实上的行业标准开发框架。


<Cards>
  <Card title="快速入门与核心概念" href="/docs/ai/fastapi/01-快速入门与核心概念" description="环境配置、类型提示、首个应用与 OpenAPI 规范" />
  <Card title="请求参数与 Pydantic 模型" href="/docs/ai/fastapi/02-请求参数与Pydantic模型" description="路径/查询/请求体/校验器/表单与上传" />
  <Card title="响应处理与状态码" href="/docs/ai/fastapi/03-响应处理与状态码" description="响应模型、状态码、自定义响应与流式输出" />
  <Card title="依赖注入系统" href="/docs/ai/fastapi/04-依赖注入系统" description="Depends、子依赖、yield 资源释放与 JWT 认证" />
  <Card title="SQL关系型数据库与ORM实战" href="/docs/ai/fastapi/05-SQL关系型数据库与ORM实战" description="官方分层结构、SQLAlchemy、一对多关联、SQLModel 与 Alembic" />
  <Card title="中间件与生命周期与异常" href="/docs/ai/fastapi/06-中间件与生命周期与异常" description="中间件、CORS、Lifespan、异常处理与后台任务" />
  <Card title="大型工程化与 APIRouter" href="/docs/ai/fastapi/07-大型工程化与APIRouter" description="项目架构分层、模块路由、Settings 与自动化测试" />
  <Card title="高并发异步与 AI 流式实战" href="/docs/ai/fastapi/08-高并发异步与AI流式实战" description="异步机制、SSE、大模型流式响应与 WebSocket" />
</Cards>


## 官方资料 [#官方资料]


<Cards>
  <Card title="FastAPI 官方文档" href="https://fastapi.tiangolo.com/zh/" description="FastAPI 官方文档 (支持多语言)" external />
  <Card title="FastAPI GitHub" href="https://github.com/tiangolo/fastapi" description="tiangolo/fastapi 源码仓库" external />
  <Card title="SQLModel 官方文档" href="https://sqlmodel.tiangolo.com/" description="FastAPI 作者打造的 SQLAlchemy + Pydantic 二合一 ORM 库" external />
  <Card title="Pydantic 官方文档" href="https://docs.pydantic.dev/latest/" description="Pydantic 数据验证与设置管理库" external />
  <Card title="Starlette 官方文档" href="https://www.starlette.io/" description="FastAPI 底层高性能 ASGI 核心框架" external />
  <Card title="Uvicorn 官方文档" href="https://www.uvicorn.org/" description="极速异步 ASGI Web 服务器" external />
</Cards>


## 学习资源 [#学习资源]


<Cards>
  <Card title="FastAPI 官方教程精讲" href="https://search.bilibili.com/all?keyword=fastapi%E6%95%99%E7%A8%8B" description="哔哩哔哩精选视频教程" external />
</Cards>
