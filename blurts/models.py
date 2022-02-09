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