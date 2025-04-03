from django.urls import re_path
from .consumers import VolunteerConsumer

websocket_urlpatterns = [
    re_path(r"ws/volunteers/$", VolunteerConsumer.as_asgi()),
]