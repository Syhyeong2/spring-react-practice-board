# 빌드 스테이지
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# 배포 스테이지
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Nginx 포트 설정
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]