from django.db import models
from accounts.models import UserProfile

# BlURT Model

def user_directory_path(instance, filename):
	return 'blurts/users/{0}/blurt/{1}/images/{2}'.format(instance.author.user.id, instance.id, filename)

class Blurt(models.Model):
	content = models.TextField(null=True, blank=False)
	author = models.ForeignKey(UserProfile, null=True, on_delete=models.SET_NULL)
	image = models.ImageField(upload_to=user_directory_path, blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True, auto_now=False)

	def __str__(self):
		try:
			return (f'blurt #{self.id} - @{self.author.user.username}')
		except:
			return (f'blurt #{self.id} - @NULL')

# Blurt Likes
class BlurtLike(models.Model):
	blurt= models.ForeignKey(Blurt, null=True, on_delete=models.CASCADE)
	user_profile = models.ForeignKey(UserProfile, null=True, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now_add=True, auto_now=False)

	class Meta:
		unique_together = ('blurt', 'user_profile')

# BLurt Comments
class BlurtComment(models.Model):
	blurt= models.ForeignKey(Blurt, null=True, on_delete=models.CASCADE)
	content = models.TextField(null=True, blank=False)
	author = models.ForeignKey(UserProfile, null=True, on_delete=models.SET_NULL)
	created_at = models.DateTimeField(auto_now_add=True, auto_now=False)

class BlurtCommentLike(models.Model):
	blurt_comment = models.ForeignKey(BlurtComment, null=True, on_delete=models.CASCADE)
	user_profile = models.ForeignKey(UserProfile, null=True, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now_add=True, auto_now=False)

	class Meta:
		unique_together = ('blurt_comment', 'user_profile')