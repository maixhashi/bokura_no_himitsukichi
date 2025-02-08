set -o errexit

mkdir -p /opt/render/project/src/backend_src/backend/dist/movie_posters

cd backend_src
pip install -r requirements_prod.txt

cd backend
python manage.py migrate
python manage.py fetch_and_create_rewards
python manage.py collectstatic --no-input
