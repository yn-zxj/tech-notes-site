# 基本命令 (/docs/backend/docker/basic)

## 帮助命令 [#帮助命令]

```bash 
systemctl start docker # 启动docker
systemctl stop docker  # 关闭docker
systemctl restart docker # 重启docker
systemctl enable docker  # docker设置随服务启动而自启动
systemctl status docker  # 查看docker 运行状态
```

```bash 
docker version  # 显示docker版本信息
docker info     # 显示docker系统信息，包括镜像和容器数

docker --help          # 显示帮助信息
docker COMMAND --help  # 显示命令的帮助信息

# 例如：
docker images --help
docker container --help
```

**帮助命令地址**：[https://docs.docker.com/reference/](https://docs.docker.com/reference/)

## 镜像的基本命令 [#镜像的基本命令]

### docker images [#docker-images]

**作用**：显示本地主机上的镜像

```shell 
# docker images [OPTIONS] [REPOSITORY[:TAG]]

ubuntu@root:~$ docker images
REPOSITORY                 TAG       IMAGE ID       CREATED        SIZE
neosmemo/memos             0.18.2    80a11a64ffad   8 days ago     61.1MB
jc21/nginx-proxy-manager   2.10.4    27b3e4961f08   2 weeks ago    843MB
shuiche/mind-map           latest    4b4390822c54   2 months ago   25.5MB
```

**解释**：
`REPOSITORY`：镜像的仓库源
`TAG`：镜像的标签
`IMAGE ID`：镜像的 ID
`CREATED`：镜像的创建时间
`SIZE`：镜像的大小

**可选项**：
`-a, --all`：列出所有镜像
`-q, --quiet`：只显示镜像的 ID

### docker search [#docker-search]

**作用**：搜索 Docker Hub 中的镜像

```shell 
# docker search [OPTIONS] TERM
docker search nginx                     # 搜索nginx镜像
docker search nginx --filter=STARS=500  # 搜索STARS大于500的nginx镜像（过滤）
```

### docker pull [#docker-pull]

**作用**：从镜像仓库下载镜像

```shell 
# docker pull [OPTIONS] NAME[:TAG|@DIGEST]
docker pull nginx         # 下载nginx镜像
docker pull nginx:latest  # 下载nginx最新的镜像

# 例如
root@learn ~ % docker pull neosmemo/memos
Using default tag: latest # 不写tag，默认下载最新版
latest: Pulling from neosmemo/memos
c30352492317: Already exists  # 分层下载（存在即共用）
d8ae814ab1c6: Pull complete
3fb4c2928579: Pull complete
53656755af84: Pull complete
ebf1d6d6b0e4: Pull complete
6a2cef4ab53d: Pull complete
Digest: sha256:84fe8465d1ec9ab729a37a7c6b93fd8efa1f1d190ed08dcc4a0b53f43530d64e
Status: Downloaded newer image for neosmemo/memos:latest
docker.io/neosmemo/memos:latest # 真实地址
```

### docker rmi [#docker-rmi]

**作用**：删除镜像

```shell 
# docker rmi [OPTIONS] IMAGE [IMAGE...]
docker rmi -f images_id                       # 强制删除指定镜像
docker rmi -f images_id, images_id, images_id # 强制删除多个镜像
docker rmi -f images_name:tag                 # 删除指定标签镜像
docker rmi -f $(docker images -aq)            # 删除所有镜像

# 例如
root@learn ~ % docker rmi neosmemo/memos
Untagged: neosmemo/memos:latest
Untagged: neosmemo/memos@sha256:84fe8465d1ec9ab729a37a7c6b93fd8efa1f1d190ed08dcc4a0b53f43530d64e
Deleted: sha256:30b4d6be60366d1fe75b3f091d9cd973c18e92da49e9d2967bb30b30ba89e19a
Deleted: sha256:03adeca7d9a71bde2730b239dfc8511d7f64b8b6462e06531d48f614bc8aea0e
Deleted: sha256:230df41bf772b3df3bbcb80bda3049b66425bd273d71a2d5bd114ff645b0ebe4
Deleted: sha256:93b49e860ee0767578592c72f8b4fb3de89831fefb2fd0fd2d3b7fd882492fb0
Deleted: sha256:0666208f764a4e2e1a7b2d5fe8993a1e1049097ab0a83fb8d6dc4aa185c31de4
Deleted: sha256:f1f76bf1c651aeb5f83266c1b08917bca0f58d0723a6630b4e1ac476d6145db8
```

## 容器的基本命令 [#容器的基本命令]

### docker run [#docker-run]

**作用**：创建并启动一个容器

```shell 
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

**参数说明**：
`--name="container_name"`：容器名字
`-d`：后台运行
`-it`：使用交互方式运行，进入容器查看内容
`-p`：指定容器的端口
`-P`：随机指定端口
`-v`：将我们主机的目录与容器内的目录进行映射
`-e`：设置环境变量
`--network="host"`：将我们容器连接到主机上
`--network="bridge"`：桥接网络

### docker ps [#docker-ps]

**作用**：查看当前所有运行的容器

```shell 
docker ps [OPTIONS]
```

**参数说明**：
`-a`：显示所有的容器，包括未运行的
`-l`：显示最近创建的容器
`-n`：显示最近 n 个创建的容器
`--no-trunc`：不截断输出
`-q`：静默模式，只显示容器编号


<Callout type="success" title="docker ps 发现容器停止了">

常见的坑：docker 容器后台运行，必须有一个前台进程，否则会自动停止

</Callout>


### docker rm [#docker-rm]

**作用**：删除一个或多少容器

```shell 
docker rm [OPTIONS] CONTAINER [CONTAINER...]

docker rm -f $(docker ps -aq)     # 删除所有容器
docker ps -a -q |xargs docker rm  # 删除所有容器
```

**参数说明**：
`-f, --force`：强制删除正在运行的容器（使用 SIGKILL）
`-l, --link`：删除指定的链接
`-v, --volumes`：删除与容器关联的匿名卷

### docker start [#docker-start]

**作用**：启动容器

```shell 
docker start [OPTIONS] CONTAINER [CONTAINER...]
```

### docker restart [#docker-restart]

**作用**：重启容器

```shell 
docker restart [OPTIONS] CONTAINER [CONTAINER...]
```

### docker stop [#docker-stop]

**作用**：停止容器

```shell 
docker stop [OPTIONS] CONTAINER [CONTAINER...]
```


<Callout type="success" title="退出容器">

```shell 
exit         # 直接退出容器
Ctr + P + Q  # 容器不停止退出
```

</Callout>


### docker kill [#docker-kill]

**作用**：强制停止容器

```shell 
docker kill [OPTIONS] CONTAINER [CONTAINER...]
```

## 其它命令 [#其它命令]

### docker logs [#docker-logs]

**作用**：查看容器日志

```shell 
docker logs [OPTIONS] CONTAINER

# 查看容器自2024-01-01之后的最新10条日志
docker logs --since="2024-01-01" --tail=10 nginx
```

**参数说明**：
`--details`：显示额外的日志详细信息
`-f, --follow`：跟踪日志输出
`--since string`：显示某个开始时间的所有日志(e.g. 2013-01-02T13:23:37Z or 42m for 42 minutes)
`-n, --tail string`：仅列出最新 N 条容器日志
`-t, --timestamps`：显示时间戳
`--until string`：显示时间戳或相对时间戳之前的日志

### docker top [#docker-top]

**作用**：查看容器中运行的进程

```shell 
docker top CONTAINER [ps OPTIONS]

ubuntu@root:~$ docker top a89556ea948b
UID                 PID                 PPID                C                   STIME               TTY                 TIME                CMD
root                426706              426685              0                   Jan19               ?                   00:00:41            ./memos
```

### docker inspect [#docker-inspect]

**作用**：查看容器/镜像的元数据

```shell 
docker inspect [OPTIONS] NAME|ID [NAME|ID...]
```

**参数说明**：
`-f, --format string`：格式化输出（eg: json）
`-s, --size`：如果类型为容器，则显示总文件大小
`--type string`：返回指定类型的 JSON


<details>
<summary>docker inspect 示例</summary>

```shell 
ubuntu@root:~$ docker inspect 80a11a64ffad
[
    {
        "Id": "sha256:80a11a64ffadd5f08423a018bdbae1379554c91c31c918bc97a0e00e249c6917",
        "RepoTags": [
            "neosmemo/memos:0.18.2"
        ],
        "RepoDigests": [
            "neosmemo/memos@sha256:84fe8465d1ec9ab729a37a7c6b93fd8efa1f1d190ed08dcc4a0b53f43530d64e"
        ],
        "Parent": "",
        "Comment": "buildkit.dockerfile.v0",
        "Created": "2024-01-19T10:11:06.768332925Z",
        "Container": "",
        "ContainerConfig": {
            "Hostname": "",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": null,
            "Cmd": null,
            "Image": "",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": null,
            "Labels": null
        },
        "DockerVersion": "",
        "Author": "",
        "Config": {
            "Hostname": "",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "ExposedPorts": {
                "5230/tcp": {}
            },
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "TZ=UTC",
                "MEMOS_MODE=prod",
                "MEMOS_PORT=5230"
            ],
            "Cmd": null,
            "Image": "",
            "Volumes": {
                "/var/opt/memos": {}
            },
            "WorkingDir": "/usr/local/memos",
            "Entrypoint": [
                "./memos"
            ],
            "OnBuild": null,
            "Labels": {
                "org.opencontainers.image.created": "2024-01-19T10:08:39.159Z",
                "org.opencontainers.image.description": "An open source, lightweight note-taking service. Easily capture and share your great thoughts.",
                "org.opencontainers.image.licenses": "MIT",
                "org.opencontainers.image.revision": "ec4884ea04c866e4d74e54854b2e3d1be7f369f6",
                "org.opencontainers.image.source": "https://github.com/usememos/memos",
                "org.opencontainers.image.title": "memos",
                "org.opencontainers.image.url": "https://github.com/usememos/memos",
                "org.opencontainers.image.version": "0.18.2"
            }
        },
        "Architecture": "amd64",
        "Os": "linux",
        "Size": 61059980,
        "VirtualSize": 61059980,
        "GraphDriver": {
            "Data": {
                "LowerDir": "/var/lib/docker/overlay2/d7e85c6e128f8b7c78ddc67f519d9c795d79a469ec5864ece25f26205f5e1e87/diff:/var/lib/docker/overlay2/6bf575f8568767e585ea5ed0a1d8300c59b202d6c251c596bb7d110f8cd4bc32/diff:/var/lib/docker/overlay2/d024069c2b185e68bfcb580f88e8f7e7112273e1c181ee4e7272eab755ef3403/diff:/var/lib/docker/overlay2/d2a6052a734eec404473d62cb3ec056b9d1d12c8faa45961f19f91b2507198a7/diff:/var/lib/docker/overlay2/2c88425e76d360adc6e614fe2e37f5b82f87527319b3308f9fbc879c901aebb5/diff",
                "MergedDir": "/var/lib/docker/overlay2/6c4e8fb99a5112068b3fbddd933fb5c849eaed7b66ba5f6380a94915e089021d/merged",
                "UpperDir": "/var/lib/docker/overlay2/6c4e8fb99a5112068b3fbddd933fb5c849eaed7b66ba5f6380a94915e089021d/diff",
                "WorkDir": "/var/lib/docker/overlay2/6c4e8fb99a5112068b3fbddd933fb5c849eaed7b66ba5f6380a94915e089021d/work"
            },
            "Name": "overlay2"
        },
        "RootFS": {
            "Type": "layers",
            "Layers": [
                "sha256:5af4f8f59b764c64c6def53f52ada809fe38d528441d08d01c206dfb3fc3b691",
                "sha256:dcff3711ebbd22ab6a88e76f7c645866bf96ff9e62861f8c5b04d7773bee3093",
                "sha256:ca3b593e3da9624bc9dc4896f98a8e6f74540522b9cf8bb51877686d9bdaaf70",
                "sha256:8c755c1a43cdcfe9df8652adfe9d7a3fd970c4265d10b3c65d8c798b8c854407",
                "sha256:c47f2324c205a5a03b3e6a99eab4d8c290efd78dc0f4a64f9c8601f31b965bef",
                "sha256:b78430cb14fc071ccd7760ce2377ccae9e46c93cb841cbb5ded9881dfc79a02a"
            ]
        },
        "Metadata": {
            "LastTagTime": "0001-01-01T00:00:00Z"
        }
    }
]
```

</details>


### docker attach [#docker-attach]

**作用**：连接到正在运行中的容器

```shell 
docker attach [OPTIONS] CONTAINER
```

### docker exec [#docker-exec]

**作用**：在运行中的容器中执行命令

```shell 
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
```


<details>
<summary>示例</summary>

```shell 
ubuntu@root:~$ docker exec -it 185caa2b4f47 /bin/bash
 _   _       _            ____                      __  __
| \ | | __ _(_)_ __ __  _|  _ \ _ __ _____  ___   _|  \/  | __ _ _ __   __ _  __ _  ___ _ __
|  \| |/ _` | | '_ \\ \/ / |_) | '__/ _ \ \/ / | | | |\/| |/ _` | '_ \ / _` |/ _` |/ _ \ '__|
| |\  | (_| | | | | |>  <|  __/| | | (_) >  <| |_| | |  | | (_| | | | | (_| | (_| |  __/ |
|_| \_|\__, |_|_| |_/_/\_\_|   |_|  \___/_/\_\\__, |_|  |_|\__,_|_| |_|\__,_|\__, |\___|_|
       |___/                                  |___/                          |___/
Version 2.10.4 (1c498f8) 2024-01-08 00:21:20 UTC, OpenResty 1.21.4.2, debian 10 (buster), Certbot certbot 2.5.0
Base: debian:buster-slim, linux/amd64
Certbot: jc21/nginx-full:latest, linux/amd64
Node: jc21/nginx-full:certbot, linux/amd64

[root@docker-185caa2b4f47:/app]#
```

</details>



<Callout type="success" title="docker attach 和 docker exec 的区别">

`docker exec`进入容器后开启一个新的终端，可以在里面操作(常用)
`docker attach`进入容器正在执行的终端，不会启动新的进程(只是附着到容器上)

&#8195;&#8195;如果 Docker 容器是使用`/bin/bash`命令启动的，则可以使用 attach 来访问它，如果不是，则需要在容器内创建一个 bash 实例。

</Callout>


### docker cp [#docker-cp]

**作用**：命令用于在容器和主机之间复制文件

```shell 
# 复制文件到主机(docker cp container_id:src_path dest_path)
docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|-

# 复制文件到容器(docker cp src_path container_id:dest_path)
docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH
```


<details>
<summary>docker cp 示例</summary>

```shell 
# 主机复制文件进容器
ubuntu@root:~$ pwd # 主机路径
/home/ubuntu
ubuntu@root:~$ ls # 当前路径下存在的测试文件
cp_test.txt
ubuntu@root:~$ docker ps # 正在运行的容器
CONTAINER ID   IMAGE                             COMMAND                  CREATED       STATUS                 PORTS                                                                                                               NAMES
e7c34de37a97   ghcr.io/wg-easy/wg-easy:latest    "docker-entrypoint.s…"   5 days ago    Up 5 days              0.0.0.0:51820->51820/udp, :::51820->51820/udp, 0.0.0.0:51821->51821/tcp, :::51821->51821/tcp                        WireGuard

ubuntu@root:~$ docker exec -it e7c34de37a97 /bin/bash
3f765b569163:/app# pwd # 容器内路径
/app
3f765b569163:/app# ls # 容器内路径下的文件
config.js           lib                 package-lock.json   package.json        server.js           services            tailwind.config.js  www
3f765b569163:/app# exit # 退出容器
exit
ubuntu@root:~$ docker cp cp_test.txt e7c34de37a97:/app # 将主机上的测试文件复制到容器内的/app路径下
Successfully copied 1.54kB to e7c34de37a97:/app

ubuntu@root:~$ docker exec -it e7c34de37a97 /bin/bash # 进入容器查看(文件成功复制)
3f765b569163:/app# ls
config.js           cp_test.txt         lib                 package-lock.json   package.json        server.js           services            tailwind.config.js  www
3f765b569163:/app#

# 容器文件复制进主机
ubuntu@root:~$ docker cp e7c34de37a97:/app/server.js /home/ubuntu # 将容器内存在server.js复制到主机
Successfully copied 2.05kB to /home/ubuntu
ubuntu@root:~$ ls # 主机路径下文件查看(成功复制)
cp_test.txt  server.js
```

</details>
