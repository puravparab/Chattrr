from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.contrib.auth.models import User
from accounts.models import UserProfile
from accounts.serializers import UserProfileSerializer

@api_view(["GET"])
def userSearch(request, format=None):
	query = request.GET.get('q', '')
	limit = int(request.GET.get('limit', 10))

	user_list = UserProfile.objects.filter(user__username__icontains=query)[:limit]
	if not user_list.exists():
		return Response({"detail": f"Query {query} does not have any results."}, status=status.HTTP_404_NOT_FOUND)

	serializer = UserProfileSerializer(user_list, many=True)
	data = {
		'users': serializer.data,
		'no_of_users': user_list.count()
	}

	return Response(data, status=status.HTTP_200_OK)