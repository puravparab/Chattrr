"""blurts URL Configuration

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
from django.urls import path
from .views import *

app_name = 'blurts'

urlpatterns = [
    # Blurt
    path('create', createBlurt, name='blurt-create'),
    path('delete/<int:blurt_id>', deleteBlurt, name='blurt-delete'),
    path('<int:blurt_id>', blurt_detail, name='blurt-id'),
    path('list', blurt_list, name='blurt-list'),

    # Blurt Like
    path('like/<int:blurt_id>', like_blurt.as_view(), name='blurt-like'),
    path('like/<int:blurt_id>/list', blurt_likes_list, name='blurt-like-list'),

    # Blurt Comment
    path('comment/<int:blurt_id>', blurt_comment.as_view(), name='blurt-comment'),
    path('comment/<int:blurt_id>/list', blurt_comment_list, name='blurt-comment-list'),

    # Blurt Comment Like:
    path('comment/<int:blurt_comment_id>/like', blurt_comment_like, name='blurt-comment-like'),
    path('comment/<int:blurt_comment_id>/like/list', blurt_comment_like_list, name='blurt-comment-like-list'),
]