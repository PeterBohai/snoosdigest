# Generated by Django 4.0.3 on 2022-07-29 03:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_usersubscription'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='usersubscription',
            table='users_user_subscriptions',
        ),
    ]
