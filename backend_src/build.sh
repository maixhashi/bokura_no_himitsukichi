set -o errexit

# フロントエンドの dist/movie_posters を作成
mkdir -p /opt/render/project/src/frontend_src/node/frontend/dist/movie_posters

# Django の `collectstatic` 用のディレクトリも作成
mkdir -p /opt/render/project/src/backend_src/backend/staticfiles

cd backend_src
pip install -r requirements_prod.txt

cd backend
python manage.py migrate
python manage.py fetch_and_create_rewards
python manage.py collectstatic --no-input
