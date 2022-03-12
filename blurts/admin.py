from django.contrib import admin
from .models import Blurt, BlurtLike

@admin.register(Blurt)
class Blurt(admin.ModelAdmin):
	list_display = ('id', 'content', 'author', 'created_at')
	fields = ['content', 'author']

@admin.register(BlurtLike)
class BlurtLikes(admin.ModelAdmin):
	list_display = ('id', 'blurt', 'user_profile', 'created_at')
	fields = ['blurt', 'user_profile']