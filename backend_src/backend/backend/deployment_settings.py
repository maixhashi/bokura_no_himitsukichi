import os 

import dj_database_url
from pathlib import Path
from .settings import * 
from .settings import BASE_DIR

SECRET_KEY = os.environ.get('SECRET_KEY')

DEBUG = os.environ.get('DEBUG')

ALLOWED_HOSTS = [
    os.environ.get('RENDER_EXTERNAL_HOSTNAME'),
    os.environ.get('RENDER_FRONTEND_HOSTNAME'),
]
CSRF_TRUSTED_ORIGINS = ['https://'+os.environ.get('RENDER_EXTERNAL_HOSTNAME')]
CORS_ORIGIN_WHITELIST = [
    'https://moviedig-frontend.onrender.com',
]
CSRF_COOKIE_SECURE = os.environ.get('CSRF_COOKIE_SECURE')
SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE')

SESSION_COOKIE_SAMESITE = os.environ.get('SESSION_COOKIE_SAMESITE')
CSRF_COOKIE_SAMESITE = os.environ.get('CSRF_COOKIE_SAMESITE')


MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOWED_ORIGINS = [
    'https://moviedig-frontend.onrender.com'
]

STORAGES = {
    "default":{
        "BACKEND" : "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND" : "whitenoise.storage.CompressedStaticFilesStorage",
    },

}

DATABASES = {
    'default': dj_database_url.config(
        default= os.environ['DATABASE_URL'], 
        conn_max_age=600
    )
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "frontend/public/assets"),  # assets フォルダを静的ファイルに追加
]

ADMINS = [("CBI Analytics", "YOUREMAIL@EMAIL.com")]

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_PASSWORD')
DEFAULT_FROM_EMAIL = 'default from email'