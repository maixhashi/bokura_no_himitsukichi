set -o errexit

mkdir -p /opt/render/project/src/backend_src/backend/frontend/public/assets/movie_posters

cd backend_src
pip install -r requirements_prod.txt

cd backend
python manage.py migrate
python manage.py fetch_and_create_rewards
python manage.py collectstatic --no-input


# if [[ $CREATE_SUPERUSER ]]
# then
#     python manage.py createsuperuser --no-input
# fi