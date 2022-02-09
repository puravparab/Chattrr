from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view, parser_classes
from requests import post

from django.contrib.auth.models import User, Group
from .models import UserProfile
from blurts.models import Blurt
from blurts.serializers import BlurtSerializer
from .serializers import UserProfileSerializer

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
				return Response(messages, status=status.HTTP_200_OK)

		except Exception as e:
			messages['errors'] = str(e)
			return Response(messages, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# LOG IN USER::
class loginuser(APIView):
	parser_classes = [JSONParser]

	def post(Self, request):
		return Response({}, status=status.HTTP_200_OK)

# GET user by username
@api_view(["GET"])
@parser_classes([JSONParser])
def user_profile_detail(request, username):
	if request.method == "GET":
		user = User.objects.filter(username=username)
		if not user.exists():
			return Response({"errors": f'username({username}) does not exist'}, status=status.HTTP_404_NOT_FOUND)	
		else:
			user_profile = UserProfile.objects.filter(user=user[0])
			if not user_profile.exists():
				return Response({"errors": f'User Profile for username({username}) does not exist'}, status=status.HTTP_404_NOT_FOUND)
			else:
				user_profile = user_profile[0]

		serializer = UserProfileSerializer(user_profile)
		return Response(serializer.data, status=status.HTTP_200_OK)

# GET all Blurts by username and blurt id
@api_view(["GET"])
@parser_classes([JSONParser])
def user_blurts(request, username):
	if request.method == "GET":
		params = request.GET.dict()
		blurt_id = params.get("id")

		user = User.objects.filter(username=username)
		if not user.exists():
			return Response({"errors": f'username({username}) does not exist'}, status=status.HTTP_404_NOT_FOUND)	
		else:
			user_profile = UserProfile.objects.filter(user=user[0])
			if not user_profile.exists():
				return Response({"errors": f'User Profile for username({username}) does not exist'}, status=status.HTTP_404_NOT_FOUND)
			else:
				user_profile = user_profile[0]

		if blurt_id != None:
			try:
				blurts = Blurt.objects.filter(id=blurt_id, author=user_profile)
				if not blurts.exists():
					return Response({"errors": f'Blurt Id-{blurt_id} cannot be found for username({username})'}, status=status.HTTP_404_NOT_FOUND)
				else:
					blurts = blurts[0]
					serializer = BlurtSerializer(blurts)
					return Response(serializer.data, status=status.HTTP_200_OK)
			except Exception as e:
				return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

		else:
			try:
				blurts = Blurt.objects.filter(author=user_profile)
				if not blurts.exists():
					return Response({"errors": f'Blurts for username({username}) cannot be found.'}, status=status.HTTP_404_NOT_FOUND)
				else:
					serializer = BlurtSerializer(blurts, many=True)
					return Response(serializer.data, status=status.HTTP_200_OK)
			except Exception as e:
				return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

		return Response({}, status=status.HTTP_200_OK)