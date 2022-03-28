from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='user.username')
	email = serializers.EmailField(source='user.email')
	class Meta:
		model = UserProfile
		fields = ('id', 'username', 'display_name', 'bio', 'email', 'created_at')