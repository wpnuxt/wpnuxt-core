FROM node:21-slim
#FROM node:21-alpine as base
ENV NODE_ENV=development
WORKDIR /src

# Build
#FROM base as build
RUN corepack enable
#RUN npm install -g pnpm
#RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python

WORKDIR /src
COPY . /src
RUN pnpm install
#RUN pnpm add -D @rollup/rollup-linux-arm64-gnu
#RUN pnpm add -D @rollup/rollup-linux-arm64-musl

# Run
#FROM base
#RUN corepack enable
#COPY --from=build /src/package.json /src/pnpm-lock.yaml ./
#COPY --from=build /src/node_modules /src/node_modules

#CMD [ "ls", "-al", "/src" ]
CMD [ "pnpm", "run", "dev" ]
