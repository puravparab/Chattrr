from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser

from .models import UserProfile

# REGISTER VIEW
class RegisterUser(APIView):
	parser_classes = [JSONParser]

	def get(self, request):
		data = request.data
		username = data.get("username")
		display_name = data.get("display_name")
		password = make_password(data.get("password"))
		email = data.get("email")

		# Validate user profile data
		messages = {'details': {}, 'errors': {}}
		if UserProfile.objects.filter(email=email).exists():
			items = []
			items.append("Account with this email already exists.")
			messages['errors']["email"] = items
		if UserProfile.objects.filter(username=username).exists():
			items = []
			items.append("Account with this username already exists.")
			messages['errors']["username"] = items

		# If errors are detected
		if messages['errors'] != {}:
			return Response(messages, status=status.HTTP_400_BAD_REQUEST)
		
		# Create a UserProfile entry
		try:
			user_profile = UserProfile.objects.create(
					username = username,
					display_name = display_name,
					# password = password,
					email = email
				)
			user_profile.save()
			messages['details'] = 'Account created'
			return Response(messages, status=status.HTTP_200_OK)
		except Exception as e:
			messages['errors'] = e
			return Response(messages, status=status.HTTP_400_BAD_REQUEST)