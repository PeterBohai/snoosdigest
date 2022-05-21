# Generated by Django 4.0.3 on 2022-05-21 21:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Subreddit',
            fields=[
                ('subreddit_id', models.AutoField(primary_key=True, serialize=False)),
                ('reddit_id', models.CharField(max_length=16)),
                ('display_name', models.CharField(max_length=128)),
                ('display_name_prefixed', models.CharField(max_length=128)),
                ('reddit_url_path', models.CharField(max_length=128)),
                ('subscribers', models.PositiveIntegerField(null=True)),
                ('created_date_utc', models.DateField(null=True)),
                ('created_unix_timestamp', models.PositiveBigIntegerField(null=True)),
                ('data_updated_timestamp_utc', models.DateTimeField()),
            ],
            options={
                'db_table': 'subreddit',
            },
        ),
        migrations.CreateModel(
            name='SubredditPost',
            fields=[
                ('subreddit_post_id', models.AutoField(primary_key=True, serialize=False)),
                ('reddit_id', models.CharField(max_length=16)),
                ('reddit_url', models.CharField(max_length=256)),
                ('top_day_order', models.PositiveSmallIntegerField(null=True)),
                ('top_week_order', models.PositiveSmallIntegerField(null=True)),
                ('top_month_order', models.PositiveSmallIntegerField(null=True)),
                ('top_year_order', models.PositiveSmallIntegerField(null=True)),
                ('top_all_order', models.PositiveSmallIntegerField(null=True)),
                ('title', models.CharField(max_length=300)),
                ('body', models.TextField(blank=True, null=True)),
                ('author_name', models.CharField(max_length=64)),
                ('upvotes', models.IntegerField()),
                ('upvote_ratio', models.FloatField(null=True)),
                ('num_comments', models.PositiveIntegerField()),
                ('img_url', models.CharField(blank=True, max_length=256, null=True)),
                ('video_url', models.CharField(blank=True, max_length=256, null=True)),
                ('over_18', models.BooleanField(null=True)),
                ('spoiler', models.BooleanField(null=True)),
                ('created_timestamp_utc', models.DateTimeField()),
                ('created_unix_timestamp', models.PositiveBigIntegerField()),
                ('data_updated_timestamp_utc', models.DateTimeField()),
                ('subreddit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.subreddit')),
            ],
            options={
                'db_table': 'subreddit_post',
            },
        ),
    ]
