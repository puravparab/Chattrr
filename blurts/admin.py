from django.contrib import admin
from .models import Blurt

@admin.register(Blurt)
class Blurt(admin.ModelAdmin):
	list_display = ('id', 'content', 'author', 'created_at')
	fields = ['content', 'author']