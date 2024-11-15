# Generated by Django 5.1.1 on 2024-11-12 03:03

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="GameConfig",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("game_id", models.CharField(max_length=100, unique=True)),
                ("title", models.CharField(max_length=200)),
                ("description", models.TextField()),
                ("instructions", models.TextField()),
                ("min_score", models.IntegerField(default=0)),
                ("max_score", models.IntegerField()),
                ("time_limit", models.IntegerField(blank=True, null=True)),
                (
                    "difficulty",
                    models.CharField(
                        choices=[
                            ("easy", "Easy"),
                            ("medium", "Medium"),
                            ("hard", "Hard"),
                        ],
                        max_length=10,
                    ),
                ),
                ("category", models.CharField(max_length=100)),
                ("required_for_completion", models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name="Game",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True)),
                ("config", models.JSONField(blank=True, default=dict)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["title"],
                "indexes": [
                    models.Index(
                        fields=["is_active"], name="games_game_is_acti_ed4ca4_idx"
                    )
                ],
            },
        ),
        migrations.CreateModel(
            name="GameProgress",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("game_id", models.CharField(max_length=100)),
                ("current_level", models.IntegerField(default=1)),
                ("current_score", models.IntegerField(default=0)),
                ("time_spent", models.IntegerField(default=0)),
                ("last_played", models.DateTimeField(auto_now=True)),
                ("completed", models.BooleanField(default=False)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "indexes": [
                    models.Index(
                        fields=["user", "game_id"],
                        name="games_gamep_user_id_20c12e_idx",
                    ),
                    models.Index(
                        fields=["completed"], name="games_gamep_complet_7073f4_idx"
                    ),
                ],
                "unique_together": {("user", "game_id")},
            },
        ),
        migrations.CreateModel(
            name="GameScore",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("score", models.IntegerField(default=0)),
                ("metadata", models.JSONField(blank=True, null=True)),
                ("completed", models.BooleanField(default=False)),
                ("played_at", models.DateTimeField(default=django.utils.timezone.now)),
                (
                    "game",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="scores",
                        to="games.game",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="game_scores",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["-played_at"],
                "indexes": [
                    models.Index(
                        fields=["user", "game"], name="games_games_user_id_ba17a1_idx"
                    ),
                    models.Index(
                        fields=["completed"], name="games_games_complet_870040_idx"
                    ),
                ],
            },
        ),
    ]
