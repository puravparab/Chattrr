from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import UserProfile

@receiver(pre_save, sender=UserProfile)
def delete_profile_image_s3(sender, instance, **kwargs):
	try:
		old_instance = UserProfile.objects.get(id=instance.id)
	except UserProfile.DoesNotExist:
		return None

	if(instance.profile_image != old_instance.profile_image):
		old_instance.profile_image.delete(save=False)