from rest_framework import serializers
from .models import Blurt, BlurtLike, BlurtComment, BlurtCommentLike

class BlurtSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='author.user.username')
	email = serializers.EmailField(source='author.user.email')
	display_name = serializers.CharField(source='author.display_name')
	profile_image = serializers.ImageField(source='author.profile_image')

	class Meta:
		model = Blurt
		fields = ('id', 'content', 'username', 'display_name', 'email', 'profile_image', 'created_at')

class BlurtLikeSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='user_profile.user.username')
	blurt_id = serializers.IntegerField(source='blurt.id')

	class Meta:
		model = BlurtLike
		fields = ('id', 'blurt_id', 'username', 'created_at')

class BlurtCommentSerializer(serializers.ModelSerializer):
	author = serializers.CharField(source='author.user.username', allow_null=True, default="none")
	blurt_id = serializers.IntegerField(source='blurt.id')
	display_name = serializers.CharField(source='author.display_name', allow_null=True, default="Deleted User")

	class Meta:
		model = BlurtComment
		fields = ('id', 'blurt_id', 'author', 'display_name', 'content', 'created_at')

class BlurtCommentLikeSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='user_profile.user.username')
	blurt_comment_id = serializers.IntegerField(source='blurt_comment.id')
	blurt_id = serializers.IntegerField(source='blurt_comment.blurt.id')

	class Meta:
		model = BlurtCommentLike
		fields = ('id', 'blurt_comment_id', 'blurt_id', 'username', 'created_at')