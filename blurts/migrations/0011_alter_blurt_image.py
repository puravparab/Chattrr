# Generated by Django 4.0 on 2022-05-19 13:37

import blurts.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blurts', '0010_blurt_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blurt',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=blurts.models.user_directory_path),
        ),
    ]
