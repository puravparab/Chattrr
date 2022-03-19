"""Chattrr URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from accounts.views import user_profile_detail, user_blurts

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # Internal App Endpoints
    path('accounts/', include('accounts.urls', namespace='accounts')),
    path('blurt/', include('blurts.urls', namespace='blurts')),

    # API Endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/user/<str:username>', user_profile_detail, name='user-profile-detail'),
    path('api/user/<str:username>/blurts', user_blurts, name='user-blurts'),

    # Client (Frontend) Endpoint
    path('', TemplateView.as_view(template_name='index.html')),
    re_path(r'^(?:.*)/?$',TemplateView.as_view(template_name="index.html"))

    # TODO: Find better solution than below
    # path('home/', TemplateView.as_view(template_name='index.html')),
    # path('register/', TemplateView.as_view(template_name='index.html')),
    # path('login/', TemplateView.as_view(template_name='index.html')),
]