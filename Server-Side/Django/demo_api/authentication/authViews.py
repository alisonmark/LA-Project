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
import json

# class LoginListSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Session
#         fields = '__all__'


class Get_Login_List(APIView):

    # @csrf_protect
    def post(self, request):
        returnData = json.dumps(request.data)
        xdata = json.loads(returnData)
        login = xdata['login']
        pw = xdata['password']
        returnObj = { "login":login, "password":pw}
        return Response(returnObj,status=status.HTTP_201_CREATED)