FROM node:20-alpine

WORKDIR /usr/src/app

# 必要なファイルをコピーして依存関係をインストール
COPY node/frontend/package*.json /usr/src/app/frontend/
RUN cd /usr/src/app/frontend && yarn install

# ソースコード全体をコピー
COPY node/frontend /usr/src/app/frontend

# Viteサーバーを起動
CMD ["sh", "-c", "cd /usr/src/app/frontend && yarn dev --host"]
