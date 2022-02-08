from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, parser_classes, permission_classes

from django.contrib.auth.models import User
from .models import Blurt
from accounts.models import UserProfile
from .serializers import BlurtSerializer

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
		blurts = Blurt.objects.all()
		serializer = BlurtSerializer(blurts, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)