FROM python:3.12

# Python の出力をバッファリングせずに即座に表示
ENV PYTHONUNBUFFERED 1

# 作業ディレクトリを作成
RUN mkdir /backend
WORKDIR /backend

# 必要なライブラリのインストール
RUN pip install --upgrade pip setuptools

# 必要な依存関係をインストール
ADD requirements_dev.txt /backend/
RUN pip install -r requirements_dev.txt

# SQLite3 クライアントツールをインストール
RUN apt-get update && apt-get install -y sqlite3

# アプリケーションコードをコンテナにコピー
ADD . /backend/
