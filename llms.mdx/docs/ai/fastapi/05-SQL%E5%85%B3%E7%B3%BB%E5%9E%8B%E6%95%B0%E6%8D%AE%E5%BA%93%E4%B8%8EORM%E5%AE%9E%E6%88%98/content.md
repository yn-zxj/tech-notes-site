# SQL关系型数据库与ORM实战 (/docs/ai/fastapi/05-SQL%E5%85%B3%E7%B3%BB%E5%9E%8B%E6%95%B0%E6%8D%AE%E5%BA%93%E4%B8%8EORM%E5%AE%9E%E6%88%98)

在 FastAPI 官方文档中，**SQL (Relational) Databases** 是极具代表性的核心实战章节。FastAPI 本身不绑定任何特定的 ORM 或数据库，但官方推荐并深度集成了 **SQLAlchemy** 以及由 FastAPI 作者专门打造的 **SQLModel**。

```mermaid
flowchart TD
    Client[HTTP Request] --> API[FastAPI 路由 main.py]
    API --> Dep[yield 依赖: get_db 创建并关闭 Session]
    API --> SchemaIn[Pydantic 请求模型 UserCreate / ItemCreate]
    API --> CRUD[CRUD 函数封装 crud.py]

    CRUD --> Session[SQLAlchemy Session / AsyncSession]
    Session --> ORMModel[SQLAlchemy ORM 实体类 models.py]
    ORMModel --> DB[(SQLite / PostgreSQL / MySQL 数据库)]

    DB --> ORMModel
    ORMModel -->|from_attributes=True 自动提取| SchemaOut[Pydantic 响应模型 User / Item]
    SchemaOut --> Response[HTTP JSON Response]
```

---

## ORM 模型与 Pydantic 模型的区别与协作 [#orm-模型与-pydantic-模型的区别与协作]

在 FastAPI 中开发数据库应用，理解 **SQLAlchemy 模型** 与 **Pydantic 模型** 的分工至关重要：

| 对比维度     | SQLAlchemy / ORM 模型 (`models.py`)                                       | Pydantic 模型 (`schemas.py`)         |
| :----------- | :------------------------------------------------------------------------ | :----------------------------------- |
| **主要定位** | 数据库表结构映射与持久化操作                                              | 数据校验、请求体解析与响应数据序列化 |
| **继承基类** | `Base` (`DeclarativeBase`)                                                | `BaseModel`                          |
| **属性定义** | `Column`, `mapped_column`, `relationship`                                 | 标准类型提示、`Field(...)`           |
| **内存表现** | 代表数据库的一行记录（具有持久化状态与关联关系）                          | 纯数据容器（验证通过的字典/对象）    |
| **连接机制** | 通过 `ConfigDict(from_attributes=True)` 将 ORM 对象直接转为 Pydantic 输出 |                                      |

---

## 官方推荐的项目标准结构 [#官方推荐的项目标准结构]

遵循官方最佳实践，建议将数据库相关代码解耦为 5 个独立文件：

```txt
sql_app/
├── database.py    # 创建 SQLAlchemy 引擎、Session 会话工厂与 Base 基类
├── models.py      # SQLAlchemy 数据库表实体模型（定义表结构与外键关联）
├── schemas.py     # Pydantic 数据验证模型（定义输入和输出契约）
├── crud.py        # 数据库 CRUD（增删改查）通用函数
└── main.py        # FastAPI 路由、yield 依赖注入与应用入口
```

---

## 数据库连接与配置 (`sql_app/database.py`) [#数据库连接与配置-sql_appdatabasepy]

创建数据库引擎与 SessionLocal 会话工厂：

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# 示例采用 SQLite 数据库，生产环境可替换为 PostgreSQL / MySQL 连接串
# 例如: "postgresql://user:password@localhost:5432/dbname"
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

# connect_args={"check_same_thread": False} 仅 SQLite 需要（因为 SQLite 默认只允许单线程）
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# 创建每个请求独立的数据库会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建 ORM 模型的声明性基类
class Base(DeclarativeBase):
    pass
```

---

## 定义 SQLAlchemy ORM 模型 (`sql_app/models.py`) [#定义-sqlalchemy-orm-模型-sql_appmodelspy]

定义 `User`（用户表）和 `Item`（物品/文章表），并建立**一对多（1-to-N）双向关联**：

```python
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    # 一对多关系：一个用户拥有多个 items
    items = relationship("Item", back_populates="owner")

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    # 多对一关系：属于哪个用户
    owner = relationship("User", back_populates="items")
```

---

## 定义 Pydantic 模型 (`sql_app/schemas.py`) [#定义-pydantic-模型-sql_appschemaspy]

创建用于数据校验、创建入参和响应返回的 Pydantic 模型。


<Callout type="warn" title="Pydantic V2 属性读取模式">

在 Pydantic V2 中，使用 `model_config = ConfigDict(from_attributes=True)`（Pydantic V1 中为 `orm_mode = True`），这允许 Pydantic 直接从 ORM 对象的属性（如 `user.id`、`user.items`）中读取数据并自动完成序列化！

</Callout>


```python
from pydantic import BaseModel, ConfigDict, EmailStr

# --- Item Schemas ---
class ItemBase(BaseModel):
    title: str
    description: str | None = None

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    owner_id: int

    # 关键：开启从 ORM 对象属性读取数据的能力
    model_config = ConfigDict(from_attributes=True)

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    items: list[Item] = []  # 嵌套返回关联的 items 列表

    model_config = ConfigDict(from_attributes=True)
```

---

## 编写 CRUD 通用函数 (`sql_app/crud.py`) [#编写-crud-通用函数-sql_appcrudpy]

将所有与数据库交互的读写逻辑收敛到 `crud.py`，保持路由层代码的纯粹与简洁：

```python
from sqlalchemy.orm import Session
from . import models, schemas

# 查询单个用户（按 ID）
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

# 查询单个用户（按邮箱）
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

# 分页查询用户列表
def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

# 创建用户
def create_user(db: Session, user: schemas.UserCreate):
    # 模拟密码哈希（生产环境请使用 passlib.hash.bcrypt.hash(user.password)）
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(
        email=user.email,
        hashed_password=fake_hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)  # 刷新以获取自动生成的自增 ID
    return db_user

# 分页查询物品列表
def get_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Item).offset(skip).limit(limit).all()

# 为指定用户创建物品
def create_user_item(db: Session, item: schemas.ItemCreate, user_id: int):
    db_item = models.Item(**item.model_dump(), owner_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
```

---

## 路由与依赖注入整合 (`sql_app/main.py`) [#路由与依赖注入整合-sql_appmainpy]

通过 FastAPI 的 `yield` 依赖注入，确保每个 HTTP 请求都能获得独立的数据库会话，并在请求结束或异常时自动安全关闭：

```python
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

# 自动在数据库中建表（如果表尚不存在）
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SQLAlchemy & FastAPI 官方实战")

# yield 依赖项：每个请求独立的 Session 管理
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 类型别名
DBDep = Annotated[Session, Depends(get_db)]

# 1. 创建用户
@app.post("/users/", response_model=schemas.User, status_code=status.HTTP_201_CREATED, tags=["用户模块"])
def create_user(user: schemas.UserCreate, db: DBDep):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="该邮箱已被注册")
    return crud.create_user(db=db, user=user)

# 2. 获取用户列表（分页）
@app.get("/users/", response_model=list[schemas.User], tags=["用户模块"])
def read_users(db: DBDep, skip: int = 0, limit: int = 100):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

# 3. 获取指定用户详情（包含关联 items）
@app.get("/users/{user_id}", response_model=schemas.User, tags=["用户模块"])
def read_user(user_id: int, db: DBDep):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="用户不存在")
    return db_user

# 4. 为用户创建物品
@app.post("/users/{user_id}/items/", response_model=schemas.Item, status_code=status.HTTP_201_CREATED, tags=["物品模块"])
def create_item_for_user(user_id: int, item: schemas.ItemCreate, db: DBDep):
    return crud.create_user_item(db=db, item=item, user_id=user_id)

# 5. 获取所有物品列表
@app.get("/items/", response_model=list[schemas.Item], tags=["物品模块"])
def read_items(db: DBDep, skip: int = 0, limit: int = 100):
    items = crud.get_items(db, skip=skip, limit=limit)
    return items
```

---

## 作者官方神器：SQLModel 二合一实战 [#作者官方神器sqlmodel-二合一实战]

FastAPI 作者 Tiangolo 开源了 **SQLModel**，它将 **SQLAlchemy ORM** 和 **Pydantic** 合二为一，消除了在 `models.py` 和 `schemas.py` 之间重复定义字段的痛点。

安装 SQLModel：

```bash
pip install sqlmodel
```

### SQLModel 极简实战示例 [#sqlmodel-极简实战示例]

```python
from typing import Annotated
from fastapi import FastAPI, Depends, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select

# 1. 定义统一数据模型（既是数据库表，也是 Pydantic 校验模型）
class Hero(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    secret_name: str
    age: int | None = Field(default=None, index=True)

# 2. 数据库连接与表初始化
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# 3. 创建 Hero
@app.post("/heroes/", response_model=Hero)
def create_hero(hero: Hero, session: SessionDep) -> Hero:
    session.add(hero)
    session.commit()
    session.refresh(hero)
    return hero

# 4. 查询 Hero 列表
@app.get("/heroes/", response_model=list[Hero])
def read_heroes(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Hero]:
    heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
    return heroes
```

---

## 数据库版本迁移：Alembic 实战 [#数据库版本迁移alembic-实战]

在生产环境中，表结构会随着需求迭代不断演进，不能直接使用 `Base.metadata.create_all()`，必须使用 **Alembic** 进行版本追踪与无损迁移。

### 常用 Alembic 命令工作流 [#常用-alembic-命令工作流]

```bash
# 1. 安装 alembic
pip install alembic

# 2. 初始化迁移环境
alembic init alembic

# 3. 修改 alembic/env.py，引入目标 Base 元数据：
# from sql_app.database import Base
# from sql_app.models import User, Item
# target_metadata = Base.metadata

# 4. 自动比对代码与数据库并生成迁移脚本
alembic revision --autogenerate -m "create users and items tables"

# 5. 执行迁移应用到数据库
alembic upgrade head

# 6. 回滚一个版本
alembic downgrade -1
```

---

## 现代异步架构：SQLAlchemy 2.0 异步驱动 [#现代异步架构sqlalchemy-20-异步驱动]

在大并发与 AI 应用场景下，推荐使用 SQLAlchemy 2.0 提供的全异步 `AsyncSession`：

```python
from typing import AsyncGenerator, Annotated
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import select

DATABASE_ASYNC_URL = "sqlite+aiosqlite:///./async_app.db"

async_engine = create_async_engine(DATABASE_ASYNC_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(async_engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

class Article(Base):
    __tablename__ = "articles"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    content: Mapped[str]

async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

app = FastAPI()

@app.get("/articles/")
async def list_articles(db: Annotated[AsyncSession, Depends(get_async_db)]):
    # 异步非阻塞执行 SQL 查询
    result = await db.execute(select(Article))
    articles = result.scalars().all()
    return articles
```
