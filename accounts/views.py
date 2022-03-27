from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, parser_classes, permission_classes
from requests import post

from django.contrib.auth.models import User, Group
from .models import UserProfile
from .serializers import UserProfileSerializer
from blurts.models import Blurt, BlurtLike, BlurtComment
from blurts.serializers import BlurtSerializer, BlurtLikeSerializer

import os
from dotenv import load_dotenv
load_dotenv(override=True)

# REGISTER VIEW
# TODO: Email Verification through email
class registerUser(APIView):
	parser_classes = [JSONParser]

	def post(self, request):
		data = request.data
		username = data.get("username")
		display_name = data.get("display_name")
		password = make_password(data.get("password"))
		email = data.get("email")

		# Validate user profile data
		no_of_errors = 0
		messages = {'details': "", 
					'errors': {
						"username": "",
						"email": "",
						"password": ""
					}}

		# Validate username
		if User.objects.filter(username=username).exists():
			items = []
			items.append("An account with this username already exists.")
			messages['errors']["username"] = items
			no_of_errors += 1

		# Validate email
		if User.objects.filter(email=email).exists():
			items = []
			items.append("An account with this email already exists.")
			messages['errors']["email"] = items
			no_of_errors += 1

		# If errors are detected
		if no_of_errors != 0:
			messages["details"] = (f'There are {no_of_errors} errors with this request')
			return Response(messages, status=status.HTTP_400_BAD_REQUEST)
		
		# Create a UserProfile entry
		try:
			password = str(password)
			# Create User model
			user = User.objects.create(
				username=username, 
				email=email, 
				password=password
			)
			user.save()

			# Add to group
			group = Group.objects.get(name="User Accounts")
			user.groups.add(group)

			# Create UserProfile model
			user_profile = UserProfile.objects.create(
				user = user,
				display_name = display_name
				# username = username,
				# email = email
			)
			user_profile.save()

			messages['details'] = 'Account successfully created'

			# Get authentication tokens
			ROOT_URL = request.build_absolute_uri('/')
			tokens = post((f'{ROOT_URL}api/token/'),
				json={
					'username': username,
					'password': data.get("password")
				},
				headers={
					'content-type': 'application/json'
				})

			if tokens.ok:
				messages["tokens"] = tokens.json()
				messages["expiry"] = {'at_tk_expiry': os.getenv('ACCESS_TOKEN_LIFETIME'),
										'rt_tk_expiry': os.getenv('REFRESH_TOKEN_LIFETIME')}
				return Response(messages, status=status.HTTP_200_OK)
			else:
				return Response({"errors":tokens.json()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

		except Exception as e:
			messages['errors'] = str(e)
			return Response(messages, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# LOG IN USER::
class loginuser(APIView):
	parser_classes = [JSONParser]
	def post(Self, request):
		data = request.data
		username = data.get("username")
		email = data.get("email")
		password = data.get("password")

		ROOT_URL = request.build_absolute_uri('/')
		try:
			tokens = post((f'{ROOT_URL}api/token/'),
				json={
					'username': username,
					'password': data.get("password")
				},
				headers={
					'content-type': 'application/json'
				})
			if tokens.ok:
				return Response({'tokens': tokens.json(),
								 'expiry': {'at_tk_expiry': os.getenv('ACCESS_TOKEN_LIFETIME'),
								 			'rt_tk_expiry': os.getenv('REFRESH_TOKEN_LIFETIME')}
								}, status=status.HTTP_200_OK)
			else:
				return Response({"errors":tokens.json()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		except Exception as e:
			return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

		
# Get a new access and refresh token:
@api_view(["GET"])
def token_refresh(request, rt):
	if request.method == "GET":
		refresh_token = rt
		ROOT_URL = request.build_absolute_uri('/')
		try:
			tokens = post((f'{ROOT_URL}api/token/refresh/'),
				json={
					'refresh': refresh_token
				},
				headers={
					'content-type': 'application/json'
				})
			if tokens.ok:
				tokens = tokens.json()
				return Response({'tokens': {'access_token': tokens['access'],
											'refresh_token': tokens['refresh']},
								 'expiry': {'at_tk_expiry': os.getenv('ACCESS_TOKEN_LIFETIME'),
								 			'rt_tk_expiry': os.getenv('REFRESH_TOKEN_LIFETIME')}
								}, status=status.HTTP_200_OK)
			else:
				return Response({"errors":tokens.json()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		except Exception as e:
			return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# GET user by username
@api_view(["GET"])
@parser_classes([JSONParser])
def user_profile_detail(request, username):
	if request.method == "GET":
		user_list = User.objects.filter(username=username)
		if not user_list.exists():
			return Response({"errors": f'username: {username} does not exist'}, status=status.HTTP_404_NOT_FOUND)	
		else:
			user_profile = UserProfile.objects.filter(user=user_list[0])
			if not user_profile.exists():
				return Response({"errors": f'User Profile for username: {username}  does not exist'}, status=status.HTTP_404_NOT_FOUND)
			else:
				user_profile = user_profile[0]

		# Is user requesting their profile?
		if (username == request.user.username):
			is_user = True
		else:
			is_user = False

		# Get no of Blurts 
		blurt_list = Blurt.objects.filter(author=user_profile)
		if not blurt_list.exists():
			no_of_blurts = 0
		else:
			no_of_blurts = blurt_list.count()

		serializer = UserProfileSerializer(user_profile)
		data = {
			"user": serializer.data,
			"is_user": is_user,
			"no_of_blurts": no_of_blurts
		}
		return Response(data, status=status.HTTP_200_OK)

# GET all Blurts by username and blurt id
@api_view(["GET"])
@parser_classes([JSONParser])
def user_blurts(request, username):
	if request.method == "GET":
		is_user = False
		# Get User
		user = request.user
		user_list = User.objects.filter(username=user)
		if user_list.exists():
			user_profile = UserProfile.objects.filter(user=user_list[0])
			if not user_profile.exists():
				user_profile = None
		else:
			user_profile = None

		# Get Author
		author_list = User.objects.filter(username=username)
		if author_list.exists():
			author_profile = UserProfile.objects.filter(user=author_list[0])
			if not author_profile.exists():
				return Response({"error": f'User: {username} not found.', "no_of_blurts": 0, "is_user": is_user}, status=status.HTTP_404_NOT_FOUND)
		else:
			return Response({"error": f'User: {username} not found.', "no_of_blurts": 0, "is_user": is_user}, status=status.HTTP_404_NOT_FOUND)

		if(user.username == username):
			is_user = True

		# Get Blurts
		blurts = Blurt.objects.filter(author=author_profile[0], content__isnull=False).exclude(content="")
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

		data = {
			'blurts': serializer.data,
			'no_of_blurts': blurts.count(),
			'is_user': is_user
		}
		return Response(data, status=status.HTTP_200_OK)