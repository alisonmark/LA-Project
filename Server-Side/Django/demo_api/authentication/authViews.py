from django.shortcuts import render
from django.http import HttpResponse, Http404
from django.template import loader

from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,)
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_protect

# class LoginListSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Session
#         fields = '__all__'


class Get_Login_List(APIView):

    # @csrf_protect
    def post(self, request):
        # sessions = Session.objects.all()
        # serialized = SessionListSerializer(sessions, many=True)
        # return Response(serialized.data)

        # response = get_response(request)
        strData = request.data
        # obj = {"ABC":strData}
        return Response(strData,status=status.HTTP_201_CREATED)