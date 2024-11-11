from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/ai/analysis/(?P<task_id>\w+)/$', consumers.AnalysisConsumer.as_asgi()),
] 