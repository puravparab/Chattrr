from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, parser_classes, permission_classes

from django.contrib.auth.models import User
from .models import Blurt, BlurtLike, BlurtComment, BlurtCommentLike
from accounts.models import UserProfile
from .serializers import BlurtSerializer, BlurtLikeSerializer, BlurtCommentSerializer, BlurtCommentLikeSerializer

# TODO: Refactor
# Create a blurt
@api_view(["POST"])
@parser_classes([JSONParser, MultiPartParser])
@permission_classes([IsAuthenticated])
def createBlurt(request, format=None):
	# Process payload
	content = request.data.get("content")
	image = request.data.get("image")
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
			author = user_profile[0],
			image = image
		)
		blurt.save()
		return Response({"detail": "Blurt created succesfully"}, status=status.HTTP_200_OK)
	except Exception as e:
		return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Delete a blurt
@api_view(["DELETE"])
@parser_classes([JSONParser])
@permission_classes([IsAuthenticated])
def deleteBlurt(request, blurt_id):
	author = request.user
	# Does author exist in database?
	user = User.objects.filter(username=author)
	if not user.exists():
		return Response({'error': "author does not exist"}, status=status.HTTP_400_BAD_REQUEST)
	else:
		user_profile = UserProfile.objects.filter(user=user[0])
		if not user_profile.exists():
			return Response({'error': "author does not exist"}, status=status.HTTP_400_BAD_REQUEST)

	# Find BLurt
	blurt = Blurt.objects.filter(author=user_profile[0], id=blurt_id)
	if blurt.exists():
		try:
			blurt.delete()
			return Response({"detail" : "Blurt succesfully deleted"}, status=status.HTTP_200_OK)
		except Exception as e:
			return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	else:
		Response({"error": "Blurt does not exist"}, status=HTTP_400_BAD_REQUEST)

# TODO: Add more data to API call
# GET a specific blurt
@api_view(["GET"])
@parser_classes([JSONParser])
def blurt_detail(request, blurt_id):
	if request.method == "GET":
		# Get User
		user = request.user
		user_list = User.objects.filter(username=user)
		if user_list.exists():
			user_profile = UserProfile.objects.filter(user=user_list[0])
			if not user_profile.exists():
				user_profile = None
		else:
			user_profile = None

		blurts = Blurt.objects.filter(author__isnull=False, id=blurt_id, content__isnull=False).exclude(content="")
		if blurts.exists():
			serializer = BlurtSerializer(blurts, many=True)

			# Get Likes for each blurt
			blurtLikes = BlurtLike.objects.filter(blurt=blurts[0])
			if blurtLikes.exists():
				# Check if user has liked this comment
				if user_profile != None:
					userLike = BlurtLike.objects.filter(user_profile=user_profile[0], blurt=blurts[0])
					if not userLike.exists():
						userLike = False
					else:
						userLike = True
				else:
					userLike = False

				serializer.data[0]["likes_detail"] = {
					"no_of_likes": blurtLikes.count(),
					"has_user_liked": userLike}
			else:
				serializer.data[0]["likes_detail"] = {
					"no_of_likes": 0,
					"has_user_liked": False}

			# Get Comments for each blurt
			blurtComments = BlurtComment.objects.filter(blurt=blurts[0])
			if blurtComments.exists():
				serializer.data[0]["no_of_comments"] = blurtComments.count()
			else:
				serializer.data[0]["no_of_comments"] = 0

			# Check if requesting user is the blurt author
			if serializer.data[0]["username"] == user.username:
				serializer.data[0]["is_user_author"]  = True
			else:
				serializer.data[0]["is_user_author"]  = False

			return Response(serializer.data, status=status.HTTP_200_OK)
		else:
			return Response({"error": "blurt does not exist"}, status=status.HTTP_400_BAD_REQUEST)

# TODO: Add more data to API call
# GET all Blurts
@api_view(["GET"])
@parser_classes([JSONParser])
def blurt_list(request):
	if request.method == "GET":
		# Get User
		user = request.user
		user_list = User.objects.filter(username=user)
		if user_list.exists():
			user_profile = UserProfile.objects.filter(user=user_list[0])
			if not user_profile.exists():
				user_profile = None
		else:
			user_profile = None

		# Get Blurts
		blurts = Blurt.objects.filter(author__isnull=False, content__isnull=False).exclude(content="").order_by('-created_at')
		serializer = BlurtSerializer(blurts, many=True)

		# Iterate through each blurt
		no_of_blurts = blurts.count()
		for i in range(0, no_of_blurts):
			blurt_id = serializer.data[i]["id"]
			blurt = Blurt.objects.filter(id=blurt_id)
			if blurt.exists():
				# Get likes for each blurt
				blurtLikes = BlurtLike.objects.filter(blurt=blurt[0])
				if blurtLikes.exists():
					# Check if user has liked this comment
					if user_profile != None:
						userLike = BlurtLike.objects.filter(user_profile=user_profile[0], blurt=blurt[0])
						if not userLike.exists():
							userLike = False
						else:
							userLike = True
					else:
						userLike = False

					like_serializer = BlurtLikeSerializer(blurtLikes, many=True)
					like_data = like_serializer.data
					like_data = {
						"likes": like_serializer.data,
						"blurt_id": blurt_id,
						"no_of_likes": blurtLikes.count(),
						"has_user_liked": userLike
					}
				else:
					like_data = {
						'error': 'Blurt does not have any likes', 
						'blurt_id': blurt_id, 
						'no_of_likes': 0,
						"has_user_liked": False
					}
				serializer.data[i]["likes_detail"] = like_data

				# Get Comments for each blurt
				blurtComments = BlurtComment.objects.filter(blurt=blurt[0])
				if blurtComments.exists():
					serializer.data[i]["no_of_comments"] = blurtComments.count()
				else:
					serializer.data[i]["no_of_comments"] = 0

				# Check if requesting user is the blurt author
				if serializer.data[i]["username"] == user.username:
					serializer.data[i]["is_user_author"]  = True
				else:
					serializer.data[i]["is_user_author"]  = False

		data = {
			'blurts': serializer.data,
			'no_of_blurts': blurts.count()
		}
		return Response(data, status=status.HTTP_200_OK)

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
			return Response({'error': 'Blurt does not have any likes', 'blurt_id': blurt_id, 'no_of_likes': 0}, status=status.HTTP_200_OK)
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

@api_view(["DELETE"])
@parser_classes([JSONParser])
@permission_classes([IsAuthenticated])
def deleteComment(request, blurt_comment_id):
	# Verify User
	user = request.user
	user_list = User.objects.filter(username=user)

	if not user_list.exists():
		return Response({'error': 'User does not exist'}, status=status.HTTP_401_UNAUTHORIZED)
	else:
		user_profile = UserProfile.objects.filter(user=user_list[0])
		if not user_profile.exists():
			return Response({'error': "user does not exist"}, status=status.HTTP_401_UNAUTHORIZED)

	# Get Comment
	blurtComment = BlurtComment.objects.filter(id=blurt_comment_id, author=user_profile[0])

	if not blurtComment.exists():
		return Response({'error': 'Blurt comment does not exist'}, status=status.HTTP_400_BAD_REQUEST)

	try:
		blurtComment.delete()
		return Response({'detail': 'Blurt comment succesfully deleted'}, status=status.HTTP_200_OK)
	except Exception as e:
		return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Get all comments of a blurt:
@api_view(["GET"])
def blurt_comment_list(request, blurt_id):
	if request.method == "GET":
		# Get User
		user = request.user
		user_list = User.objects.filter(username=user)
		if user_list.exists():
			user_profile = UserProfile.objects.filter(user=user_list[0])
			if not user_profile.exists():
				user_profile = None
		else:
			user_profile = None

		# Get Blurt
		blurt = Blurt.objects.filter(id=blurt_id)
		if not blurt.exists():
			return Response({'error': 'Blurt does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

		# Get Comment
		blurtComment = BlurtComment.objects.filter(blurt=blurt[0])
		if not blurtComment.exists():
			return Response({'detail': 'Blurt does not have any comments.', 'no_of_comments': 0}, status=status.HTTP_200_OK)
		else:
			serializer = BlurtCommentSerializer(blurtComment, many=True)

			# Get Likes on Comments
			no_of_comments = blurtComment.count()
			for i in range(0, no_of_comments):
				like_data = {}
				# Get the comment
				blurt_comment_id = serializer.data[i]["id"]
				blurtComment = BlurtComment.objects.filter(id=blurt_comment_id)
				blurtCommentLike = BlurtCommentLike.objects.filter(blurt_comment = blurtComment[0])
				if not blurtCommentLike.exists():
					like_data = {'detail': 'Blurt comment does not have any likes.', 'blurt_comment_id': blurt_comment_id, 'no_of_likes': 0}
				else:
					like_serializer = BlurtCommentLikeSerializer(blurtCommentLike, many=True)

					# Check if user has liked this comment
					if user_profile != None:
						userLike = BlurtCommentLike.objects.filter(user_profile=user_profile[0], blurt_comment=blurtComment[0])
						if not userLike.exists():
							userLike = False
						else:
							userLike = True
					else:
						userLike = False

					like_data = {
						'likes': like_serializer.data,
						'blurt_comment_id': blurt_comment_id,
						'no_of_likes': blurtCommentLike.count(),
						'has_user_liked': userLike
					}
				serializer.data[i]["likes_detail"] = like_data

				if serializer.data[i]["author"] == user.username:
					serializer.data[i]["is_user_author"] = True
				else:
					serializer.data[i]["is_user_author"] = False

			data = {
				'comments': serializer.data,
				'blurt_id': blurt_id,
				'no_of_comments': no_of_comments
			}
			return Response(data, status=status.HTTP_200_OK)

# Like a comment
@api_view(["POST"])
@parser_classes([JSONParser])
@permission_classes([IsAuthenticated])
def blurt_comment_like(request, blurt_comment_id):
	if request.method == "POST":
		user = request.user
		user_list = User.objects.filter(username=user)
		if not user_list.exists():
			return Response({'error': "user does not exist"}, status=status.HTTP_401_UNAUTHORIZED)
		else:
			user_profile = UserProfile.objects.filter(user=user_list[0])
			if not user_profile.exists():
				return Response({'error': "user does not exist"}, status=status.HTTP_401_UNAUTHORIZED)

		# Find Blurt in database
		blurtComment = BlurtComment.objects.filter(id=blurt_comment_id)
		if not blurtComment.exists():
			return Response({'error': 'Blurt comment does not exist'}, status=status.HTTP_400_BAD_REQUEST)
		
		try:
			blurt_comment_like = BlurtCommentLike.objects.create(
					blurt_comment = blurtComment[0],
					user_profile = user_profile[0]
				)
			blurt_comment_like.save()
			return Response({"Detail": "Blurt comment succesfully liked"}, status=status.HTTP_200_OK)
		except:
			try:
				# If blurt_like entry exists then delete entry from database
				blurt_comment_like = BlurtCommentLike.objects.filter(blurt_comment=blurtComment[0], user_profile=user_profile[0])
				blurt_comment_like.delete()
				return Response({"Detail": "BLurt comment succesfully unliked"}, status=status.HTTP_200_OK)
			except Exception as e:
				return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Get all likes on a comment
@api_view(["GET"])
def blurt_comment_like_list(request, blurt_comment_id):
	if request.method == "GET":
		blurtComment = BlurtComment.objects.filter(id=blurt_comment_id)
		if not blurtComment.exists():
			return Response({'error': 'Blurt Comment does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

		blurtCommentLike = BlurtCommentLike.objects.filter(blurt_comment=blurtComment[0])
		if not blurtCommentLike.exists():
			return Response({'detail': 'Blurt comment does not have any likes.', 'blurt_comment_id': blurt_comment_id, 'no_of_likes': 0}, status=status.HTTP_200_OK)
		else:
			serializer = BlurtCommentLikeSerializer(blurtCommentLike, many=True)
			data = {
				'likes': serializer.data,
				'blurt_comment_id': blurt_comment_id,
				'no_of_likes': blurtCommentLike.count()
			}
			return Response(data, status=status.HTTP_200_OK)