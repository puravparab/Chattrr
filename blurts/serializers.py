from rest_framework import serializers
from .models import Blurt, BlurtLike

class BlurtSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='author.user.username')
	email = serializers.EmailField(source='author.user.email')
	display_name = serializers.CharField(source='author.display_name')

	class Meta:
		model = Blurt
		fields = ('id', 'content', 'username', 'display_name', 'email', 'created_at')

class BlurtLikeSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='user_profile.user.username')
	blurt_id = serializers.IntegerField(source='blurt.id')
	class Meta:
		model = BlurtLike
		fields = ('id', 'blurt_id', 'username', 'created_at')