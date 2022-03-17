from django.db import models
from accounts.models import UserProfile

# BlURT Model
class Blurt(models.Model):
	content = models.TextField(null=True, blank=False)
	author = models.ForeignKey(UserProfile, null=True, on_delete=models.SET_NULL)
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