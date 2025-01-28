# Generated by Django 3.2.25 on 2025-01-27 21:52

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MoviePoster',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tmdb_id', models.CharField(max_length=255, unique=True)),
                ('title', models.CharField(max_length=255)),
                ('poster_url', models.URLField()),
            ],
        ),
    ]
