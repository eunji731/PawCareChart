# 1. 빌드 환경 (질문자님의 로컬 버전 v22에 맞춤)
FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx vite build

# 2. 실행 환경 (Nginx)
FROM nginx:alpine
# 방금 만든 설정 파일을 Nginx 설정 폴더로 복사하는 줄을 추가합니다.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]