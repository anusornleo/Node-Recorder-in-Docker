FROM node:13.7.0
MAINTAINER anusornleo

WORKDIR /frontend
COPY ./package.json .index
RUN npm install
COPY . .
RUN npm install