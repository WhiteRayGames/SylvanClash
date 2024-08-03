# 使用 nginx 作为基础镜像
FROM nginx:alpine

# 复制构建好的文件到 nginx 的默认静态文件目录
COPY client/build-to-upload/web-mobile /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]