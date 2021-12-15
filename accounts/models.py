from django.db import models
from django.contrib.auth.models import User

# USER MODEL
class UserProfile(models.Model):
	user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
	username = models.CharField(max_length=20, null=True, blank=False, unique=True)
	display_name = models.CharField(max_length=20, null=True)
	email = models.EmailField(unique=True, null=True, blank=False)
	created_at = models.DateTimeField(auto_now_add=True, auto_now=False)

	def __str__(self):
		return (f'@{self.username}')