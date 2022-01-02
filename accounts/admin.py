from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfile(admin.ModelAdmin):
	list_display = ('display_name', 'created_at')
	fields =['display_name']