from django.shortcuts import render
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,)
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from .models import Post


class PostListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"

# API get detail, update, delete


class PostDetailUpdateAPIView(viewsets.GenericViewSet,
                              RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostListSerializer
    lookup_field = 'id'
    # permission_classes = [IsAuthenticated]


# API get list and create
class PostListCreateAPIView(viewsets.GenericViewSet,
                            ListCreateAPIView):
    serializer_class = PostListSerializer
    queryset = Post.objects.all()
