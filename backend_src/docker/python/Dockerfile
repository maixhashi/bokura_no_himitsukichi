FROM python:3.12

# Python の出力をバッファリングせずに即座に表示
ENV PYTHONUNBUFFERED 1

# 作業ディレクトリを作成
RUN mkdir /backend
WORKDIR /backend

# 必要な依存関係をインストール
ADD requirements.txt /backend/
RUN pip install -r requirements.txt

# SQLite3 クライアントツールをインストール
RUN apt-get update && apt-get install -y sqlite3

# アプリケーションコードをコンテナにコピー
ADD . /backend/
