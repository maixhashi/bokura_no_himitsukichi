# Generated by Django 3.2.25 on 2025-01-27 22:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('treasure_rewards', '0003_rewardimage_tmdb_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='rewardimage',
            old_name='pixel_art_image',
            new_name='pixel_art_image_path',
        ),
    ]
