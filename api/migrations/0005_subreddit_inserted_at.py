# Generated by Django 4.0.3 on 2022-08-28 15:49

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_subredditpost_unique subreddit day posts'),
    ]

    operations = [
        migrations.AddField(
            model_name='subreddit',
            name='inserted_at',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2022, 8, 28, 15, 49, 40, 781913, tzinfo=utc)),
            preserve_default=False,
        ),
    ]