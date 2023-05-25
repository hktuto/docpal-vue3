FROM nikolaik/python-nodejs AS base

RUN npm i -g pnpm

FROM base AS dependencies


