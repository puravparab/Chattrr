from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser

from django.contrib.auth.models import User, Group
from .models import UserProfile

# REGISTER VIEW
class RegisterUser(APIView):
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
			return Response(messages, status=status.HTTP_200_OK)
		except Exception as e:
			messages['errors'] = str(e)
			return Response(messages, status=status.HTTP_500_INTERNAL_SERVER_ERROR)