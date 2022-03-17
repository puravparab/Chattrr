from django.contrib import admin
from .models import Blurt, BlurtLike, BlurtComment

@admin.register(Blurt)
class Blurt(admin.ModelAdmin):
	list_display = ('id', 'content', 'author', 'created_at')
	fields = ['content', 'author']

@admin.register(BlurtLike)
class BlurtLikes(admin.ModelAdmin):
	list_display = ('id', 'blurt', 'user_profile', 'created_at')
	fields = ['blurt', 'user_profile']

@admin.register(BlurtComment)
class BlurtComment(admin.ModelAdmin):
	list_display = ('id', 'blurt', 'author', 'content', 'created_at')
	fields = ['blurt', 'author', 'content']