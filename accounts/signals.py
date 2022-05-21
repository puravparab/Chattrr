from django.db.models.signals import pre_save, pre_delete
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


@receiver(pre_delete, sender=UserProfile)
def delete_profile_image_on_user_deletion_s3(sender, instance, **kwargs):
	instance.profile_image.delete(save=False)