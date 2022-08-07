# Generated by Django 4.0.3 on 2022-08-07 20:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subreddit',
            name='display_name',
            field=models.CharField(max_length=128, unique=True),
        ),
        migrations.AlterField(
            model_name='subreddit',
            name='display_name_prefixed',
            field=models.CharField(max_length=128, unique=True),
        ),
        migrations.AlterField(
            model_name='subreddit',
            name='reddit_id',
            field=models.CharField(max_length=16, unique=True),
        ),
        migrations.AlterField(
            model_name='subreddit',
            name='reddit_url_path',
            field=models.CharField(max_length=128, unique=True),
        ),
    ]