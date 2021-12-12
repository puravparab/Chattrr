from django.contrib import admin
from .models import User

@admin.register(User)
class User(admin.ModelAdmin):
	list_display = ('display_name', 'username', 'email', 'created_at')
	fields =['display_name', 'username', 'email']