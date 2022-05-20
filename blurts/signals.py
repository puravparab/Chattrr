from django.db.models.signals import pre_delete
from django.dispatch import receiver
from .models import Blurt

@receiver(pre_delete, sender=Blurt)
def delete_blurt_image(sender, instance, **kwargs):
	instance.image.delete(save=False)