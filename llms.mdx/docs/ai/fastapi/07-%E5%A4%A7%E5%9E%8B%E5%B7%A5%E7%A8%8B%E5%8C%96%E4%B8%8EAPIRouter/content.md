# 大型工程化与 APIRouter (/docs/ai/fastapi/07-%E5%A4%A7%E5%9E%8B%E5%B7%A5%E7%A8%8B%E5%8C%96%E4%B8%8EAPIRouter)

在大型工程中，我们需要通过 **`APIRouter` 模块化组织路由、`pydantic-settings` 统一管理环境配置以及 `pytest` + `TestClient` / `httpx.AsyncClient` 进行自动化测试**。

```mermaid
graph TD
    Main[main.py 入口] --> API[app/api/v1/api.py 统一路由注册]
    API --> AuthRouter[endpoints/auth.py]
    API --> UserRouter[endpoints/users.py]
    API --> AIRouter[endpoints/agents.py]

    AuthRouter --> Services[app/services 业务逻辑层]
    UserRouter --> Services
    AIRouter --> Services
```

---

## `APIRouter` 模块化路由 [#apirouter-模块化路由]

### 1. 子模块路由定义 (`app/api/v1/endpoints/users.py`) [#1-子模块路由定义-appapiv1endpointsuserspy]

```python
from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

router = APIRouter()

class UserSchema(BaseModel):
    username: str
    email: EmailStr

@router.get("/", response_model=list[UserSchema])
async def list_users():
    return [{"username": "alice", "email": "alice@example.com"}]
```

### 2. 路由聚合分发 (`app/api/v1/api.py`) [#2-路由聚合分发-appapiv1apipy]

```python
from fastapi import APIRouter
from .endpoints import users

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["用户模块"])
```

### 3. 主入口挂载 (`main.py`) [#3-主入口挂载-mainpy]

```python
from fastapi import FastAPI
from app.api.v1.api import api_router

app = FastAPI(title="大型工程项目")
app.include_router(api_router, prefix="/api/v1")
```

---

## 现代化配置管理 (`pydantic-settings`) [#现代化配置管理-pydantic-settings]

```python
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI AI Platform"
    ENV: str = "development"
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost:5432/dbname"
    OPENAI_API_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
```

---

## 自动化测试 (Testing with Pytest & TestClient) [#自动化测试-testing-with-pytest--testclient]

FastAPI 官方推荐使用 **`TestClient`**（基于 HTTPX / Starlette）进行同步与异步接口测试：

```bash
pip install pytest pytest-asyncio httpx
```

### 编写测试用例 (`tests/test_api.py`) [#编写测试用例-teststest_apipy]

```python
import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient, ASGITransport
from main import app

# 1. 经典同步测试 TestClient
def test_read_main():
    client = TestClient(app)
    response = client.get("/api/v1/users/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# 2. 异步测试 AsyncClient
@pytest.mark.anyio
async def test_async_main():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/users/")
    assert response.status_code == 200
```
