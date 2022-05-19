from django.contrib import admin
from .models import Blurt, BlurtLike, BlurtComment, BlurtCommentLike

@admin.register(Blurt)
class Blurt(admin.ModelAdmin):
	list_display = ('id', 'content', 'author', 'image', 'created_at')
	fields = ['content', 'author', 'image']

@admin.register(BlurtLike)
class BlurtLikes(admin.ModelAdmin):
	list_display = ('id', 'blurt', 'user_profile', 'created_at')
	fields = ['blurt', 'user_profile']

@admin.register(BlurtComment)
class BlurtComment(admin.ModelAdmin):
	list_display = ('id', 'blurt', 'author', 'content', 'created_at')
	fields = ['blurt', 'author', 'content']

@admin.register(BlurtCommentLike)
class BlurtCommentLikes(admin.ModelAdmin):
	list_display = ('id', 'blurt_comment', 'user_profile', 'created_at')
	fields = ['blurt_comment', 'user_profile']