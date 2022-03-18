from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, parser_classes, permission_classes

from django.contrib.auth.models import User
from .models import Blurt, BlurtLike, BlurtComment
from accounts.models import UserProfile
from .serializers import BlurtSerializer, BlurtLikeSerializer

# TODO: Refactor
# Create a blurt
@api_view(["POST"])
@parser_classes([JSONParser])
@permission_classes([IsAuthenticated])
def createBlurt(request, format=None):
	# Process payload
	content = request.data.get("content")
	author = request.user
	# Validate content
	if len(content) > 250:
		return Response({"error": "Length of Blurt exceed"}, status=status.HTTP_400_BAD_REQUEST)

	# Does author exist in database?
	user = User.objects.filter(username=author)
	if not user.exists():
		return Response({'error': "author does not exist"}, status=status.HTTP_400_BAD_REQUEST)
	else:
		user_profile = UserProfile.objects.filter(user=user[0])
		if not user_profile.exists():
			return Response({'error': "author does not exist"}, status=status.HTTP_400_BAD_REQUEST)
	
	# Create a Blurt
	try:
		blurt = Blurt.objects.create(
			content = content,
			author = user_profile[0]
		)
		blurt.save()
		return Response({"detail": "Blurt created succesfully"}, status=status.HTTP_200_OK)
	except Exception as e:
		return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# GET all Blurts
@api_view(["GET"])
@parser_classes([JSONParser])
def blurt_list(request):
	if request.method == "GET":
		blurts = Blurt.objects.filter(author__isnull=False, content__isnull=False).exclude(content="")
		serializer = BlurtSerializer(blurts, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)

# Blurt likes views
class like_blurt(APIView):
	permission_classes = [IsAuthenticated]
	parser_classes = [JSONParser]

	# return all likes for a blurt
	def get(self, request, blurt_id):
		user = request.user
		user_list = User.objects.filter(username=user)
		if not user_list.exists():
			return Response({'error': "user does not exist"}, status=status.HTTP_401_UNAUTHORIZED)
		else:
			user_profile = UserProfile.objects.filter(user=user_list[0])
			if not user_profile.exists():
				return Response({'error': "user does not exist"}, status=status.HTTP_401_UNAUTHORIZED)

		blurt = Blurt.objects.filter(id=blurt_id)
		if not blurt.exists():
			return Response({'error': 'Blurt does not exist'}, status=status.HTTP_400_BAD_REQUEST)

		try:
			blurt_like = BlurtLike.objects.filter(
					blurt = blurt[0],
					user_profile = user_profile[0]
				)
			if not blurt_like.exists():
				return Response({"Detail": "user has not liked this blurt", 'liked': "false"}, status=status.HTTP_200_OK)
			else:
				return Response({"Detail": "user has liked this blurt", 'liked': "true"}, status=status.HTTP_200_OK)
		except Exception as e:
				return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

	# Let user like a blurt
	def post(self, request, blurt_id):
		# Find User in database
		user = request.user
		user_list = User.objects.filter(username=user)
		if not user_list.exists():
			return Response({'error': "user does not exist"}, status=status.HTTP_401_UNAUTHORIZED)
		else:
			user_profile = UserProfile.objects.filter(user=user_list[0])
			if not user_profile.exists():
				return Response({'error': "user does not exist"}, status=status.HTTP_401_UNAUTHORIZED)

		# Find Blurt in database
		blurt = Blurt.objects.filter(id=blurt_id)
		if not blurt.exists():
			return Response({'error': 'Blurt does not exist'}, status=status.HTTP_400_BAD_REQUEST)
		
		try:
			blurt_like = BlurtLike.objects.create(
					blurt = blurt[0],
					user_profile = user_profile[0]
				)
			blurt_like.save()
			return Response({"Detail": "Blurt succesfully liked"}, status=status.HTTP_200_OK)
		except:
			try:
				# If blurt_like entry exists then delete entry from database
				blurt_like = BlurtLike.objects.filter(blurt=blurt[0], user_profile=user_profile[0])
				blurt_like.delete()
				return Response({"Detail": "BLurt succesfully unliked"}, status=status.HTTP_200_OK)
			except Exception as e:
				return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
# Get all likes of a specific blurt
def blurt_likes_list(request, blurt_id):
	if request.method == "GET":
		# Find Blurt in database
		blurt = Blurt.objects.filter(id=blurt_id)
		if not blurt.exists():
			return Response({'error': 'Blurt does not exist'}, status=status.HTTP_400_BAD_REQUEST)

		blurtLikes = BlurtLike.objects.filter(blurt=blurt[0])

		if not blurtLikes:
			return Response({'blurt_id': blurt_id, 'no_of_likes': 0}, status=status.HTTP_200_OK)
		else:
			serializer = BlurtLikeSerializer(blurtLikes, many=True)
			data = {
				'likes': serializer.data,
				'blurt_id': blurt_id,
				'no_of_likes': blurtLikes.count()
			}
			return Response(data, status=status.HTTP_200_OK)

# Blurt Comments View
class blurt_comment(APIView):
	permission_classes = [IsAuthenticated]
	parser_classes = [JSONParser]

	# Create a comment on a blurt
	def post(self, request, blurt_id):
		# Verify User
		user = request.user
		user_list = User.objects.filter(username=user)

		if not user_list.exists():
			return Response({'error': 'User does not exist'}, status=status.HTTP_401_UNAUTHORIZED)
		else:
			user_profile = UserProfile.objects.filter(user=user_list[0])
			if not user_profile.exists():
				return Response({'error': "user does not exist"}, status=status.HTTP_401_UNAUTHORIZED)

		# Find Blurt in Database
		blurt = Blurt.objects.filter(id=blurt_id)
		if not blurt.exists():
			return Response({'error': 'Blurt does not exist'}, status=status.HTTP_400_BAD_REQUEST)

		content = request.data.get("content")
		# Validate content
		if len(content) > 250:
			return Response({"error": "Length of Blurt exceed"}, status=status.HTTP_400_BAD_REQUEST)

		# Create a comment
		try:
			blurtComment = BlurtComment.objects.create(
					content = content,
					author = user_profile[0],
					blurt = blurt[0]
				)
			blurtComment.save()
			return Response({"detail": 'comment succesfully posted'}, status=status.HTTP_200_OK)
		except Exception as e:
			return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)