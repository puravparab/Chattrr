from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfile(admin.ModelAdmin):
	list_display = ('id', 'user', 'display_name', 'bio', 'created_at')
	fields = ['display_name', 'bio']