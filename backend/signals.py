from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from backend.models import Messages

@receiver(post_save, sender=Messages)
def notify_volunteer_update(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    group_name = f"volunteer_updates"
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "send_update",
            "message": {
                'to_volunteer': instance.volunteer.user.email,
                'message': instance.message,
                'from_sender': instance.from_person
            }
        },
    )