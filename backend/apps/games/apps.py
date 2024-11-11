from django.apps import AppConfig

class GamesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.games'
    label = 'games'

    def ready(self):
        import apps.games.signals 