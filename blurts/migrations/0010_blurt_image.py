# Generated by Django 4.0 on 2022-05-19 13:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blurts', '0009_blurtcommentlike'),
    ]

    operations = [
        migrations.AddField(
            model_name='blurt',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='blurts/user/{author.user.id}'),
        ),
    ]
