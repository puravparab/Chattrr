from rest_framework import serializers
from .models import Blurt

class BlurtSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='author.user.username')
	email = serializers.EmailField(source='author.user.email')
	class Meta:
		model = Blurt
		fields = ('id', 'content', 'username', 'email', 'created_at')