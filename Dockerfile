FROM node:20-slim

RUN apt-get update && apt-get install -y \
    curl \
    && apt-get clean

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

RUN npm i npm@latest -g

USER node

WORKDIR /opt/node_app

COPY --chown=node:node package.json package-lock.json* ./
RUN npm ci && npm cache clean --force
ENV PATH=/opt/node_app/node_modules/.bin:$PATH

WORKDIR /opt/node_app/app
COPY --chown=node:node . .

CMD [ "node", "bot.js" ]

LABEL org.opencontainers.image.source=https://github.com/the-bwc/webhook_youtube_live
LABEL org.opencontainers.image.authors="Patrick Pedersen <github@patrickpedersen.tech> Black Widow Company <S-1@the-bwc.com> WidowMakers <S-1@widowmakers.org>"
