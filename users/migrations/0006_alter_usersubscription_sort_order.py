# Generated by Django 4.0.3 on 2022-07-29 03:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_alter_usersubscription_sort_order'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usersubscription',
            name='sort_order',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
