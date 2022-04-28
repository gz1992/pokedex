FROM node:lts-alpine
WORKDIR /usr/src/web
COPY frontend/package.json /usr/src/web/
COPY frontend/. ./
EXPOSE 3000
CMD ["yarn", "dev"]