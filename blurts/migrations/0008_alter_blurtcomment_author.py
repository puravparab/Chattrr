# Generated by Django 4.0 on 2022-03-18 21:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_remove_userprofile_email_remove_userprofile_username'),
        ('blurts', '0007_alter_blurtlike_user_profile_blurtcomment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blurtcomment',
            name='author',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='accounts.userprofile'),
        ),
    ]
