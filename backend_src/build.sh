set -o errexit

cd backend_src
pip install -r requirements_prod.txt

cd backend
python manage.py collectstatic --no-input
python manage.py migrate


# if [[ $CREATE_SUPERUSER ]]
# then
#     python manage.py createsuperuser --no-input
# fi