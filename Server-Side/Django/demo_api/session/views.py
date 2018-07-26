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

from .models import Session

import time
import random
import hmac
import urllib
from hashlib import sha1
import json
import requests
import hashlib
import hmac


class SessionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = '__all__'


class Get_Session_List(APIView):
    def get(self, request):
        sessions = Session.objects.all()
        serialized = SessionListSerializer(sessions, many=True)
        return Response(serialized.data)

    def post(self, request):
        # sessions = Session.objects.all()
        # serialized = SessionListSerializer(sessions, many=True)
        # return Response(serialized.data)
        strData = request.data
        obj = { "name":"John", "age":30, "user":strData}
        return Response(obj,status=status.HTTP_201_CREATED)

def homepage(request):
    return render(request, 'home.html')

# # API get detail, update, delete
# class SessionDetailUpdateAPIView(viewsets.GenericViewSet,
#                               RetrieveUpdateDestroyAPIView):
#     # queryset = Session.objects.all()
#     # serializer_class = SessionListSerializer
#     # lookup_field = 'id'

#     def get(self, request):
#         sesions = Session.objects.all()
#         serialized = SessionListSerializer(sesions, many=True)
#         return Response(serialized.data)

# # API get list and create
# class SessionListCreateAPIView(viewsets.GenericViewSet,
#                             ListCreateAPIView):
#     # serializer_class = SessionListSerializer
#     # queryset = Session.objects.all()
#     def get(self, request):
#         sesions = Session.objects.all()
#         serialized = SessionListSerializer(sesions, many=True)
#         return Response(serialized.data)


# class SessionDetailUpdateAPIView(viewsets.GenericViewSet,
#                               RetrieveUpdateDestroyAPIView):
#     queryset = Session.objects.all()
#     serializer_class = SessionListSerializer
#     lookup_field = 'id'

#     # def retrieve():
#     #     return Response({'something': 'my custom JSON'})

# # API get list and create
# class SessionListCreateAPIView(viewsets.GenericViewSet,
#                             ListCreateAPIView):
#     serializer_class = SessionListSerializer
#     queryset = Session.objects.all()


# @api_view(['GET', 'POST'])
# def snippet_list(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     if request.method == 'GET':
#         snippets = Session.objects.all()
#         serializer = SessionListSerializer(snippets, many=True)
#         # return Response(serializer.data)
#         return Response({'session':serializer.data[0]})

#     # elif request.method == 'POST':
#     #     serializer = SessionListSerializer(data=request.data)
#     #     if serializer.is_valid():
#     #         serializer.save()
#     #         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     elif request.method == 'POST':
#         # httpHeaders = {'Content-Type': 'application/json','QuickBlox-REST-API-Version': '0.1.0'}
#         # requestPath = 'https://api.quickblox.com/session.json'

#         # jsonData = json.dumps(getParamsSimple())
#         # r = requests.post(requestPath, data=jsonData, headers = httpHeaders)
#         # print ('status code:', r.status_code)
#         # return r.status_code
#         return HttpResponse.status_code

def detail(request, authKey):
    authKey = Session.objects.all()
    # template = loader.get_template("Session/index.html")
    context = {
        'authKey': authKey,
    }
    # return HttpResponse(template.render(context, request))
    return render(request, 'Session/index.html', context)


# ===============================================================================================================================================================
# ========== YOUR DATA =======================
application_id = 'XXXX'
authorization_key = 'xxxxxxx-XXX-XX'
authorization_secret = 'XXXXXXXXXXXXXXXXXX'
var_login = 'user1'
var_password = 'password1'
# ===========================================

platform = "ios"     # like you want
udid = "7847674035"  # like you want


def getTimestampNonce():
    import random
    import time

    return str(time.time()), str(random.randint(1, 10000))


def createSignatureSimple(timestamp, nonce):
    stringForSignature = 'application_id={id}&auth_key={auth_key}&nonce={nonce}&timestamp={timestamp}'.format(id=application_id,
                                                                                                              auth_key=authorization_key, nonce=nonce, timestamp=timestamp)

    return hmac.new(authorization_secret, stringForSignature, sha1).hexdigest()


def getParamsSimple():
    timestamp, nonce = getTimestampNonce()
    return {'application_id': application_id,
            'auth_key': authorization_key,
            'timestamp': timestamp,
            'nonce': nonce,
            'signature': createSignatureSimple(timestamp, nonce)}


def createSignatureUser(timestamp, nonce):
    stringForSignature = 'application_id={id}&auth_key={auth_key}&nonce={nonce}&timestamp={timestamp}&user[login]={login}&user[password]={password}'.format(id=application_id,
                                                                                                                                                            auth_key=authorization_key, nonce=nonce, timestamp=timestamp, login=var_login, password=var_password)

    return hmac.new(authorization_secret, stringForSignature, sha1).hexdigest()


def getParamsUser():
    timestamp, nonce = getTimestampNonce()
    return {'application_id': application_id,
            'auth_key': authorization_key,
            'timestamp': timestamp,
            'nonce': nonce,
            'signature': createSignatureUser(timestamp, nonce),
            'user': {'login': var_login,
                     'password': var_password}}


def createSignatureDevice(timestamp, nonce):
    stringForSignature = 'application_id={id}&auth_key={auth_key}&device[platform]={platform}&device[udid]={udid}&nonce={nonce}&timestamp={timestamp}&user[login]={login}&user[password]={password}'.format(id=application_id,
                                                                                                                                                                                                            auth_key=authorization_key, platform=platform, udid=udid, nonce=nonce, timestamp=timestamp, login=var_login, password=var_password)

    return hmac.new(authorization_secret, stringForSignature, sha1).hexdigest()


def getParamsDevice():
    timestamp, nonce = getTimestampNonce()
    return {'application_id': application_id,
            'auth_key': authorization_key,
            'timestamp': timestamp,
            'nonce': nonce,
            'signature': createSignatureDevice(timestamp, nonce),
            'user': {'login': var_login,
                     'password': var_password},
            'device': {'platform': platform,
                       'udid': udid}}


def getSessionToken():
    httpHeaders = {'Content-Type': 'application/json',
                   'QuickBlox-REST-API-Version': '0.1.0'}
    requestPath = 'https://api.quickblox.com/session.json'

    jsonData = json.dumps(getParamsSimple())
    r = requests.post(requestPath, data=jsonData, headers=httpHeaders)
    print('status code:', r.status_code)
    responseJson = r.text
    print(responseJson)
    # print "===================================================="

    # print "---------  Request With User authorization ---------"
    jsonData = json.dumps(getParamsUser())
    r = requests.post(requestPath, data=jsonData, headers=httpHeaders)
    print('status code:', r.status_code)
    responseJson = r.text
    # print responseJson
    # print "===================================================="

    # print "---------  Request With Device parameters ---------"
    jsonData = json.dumps(getParamsDevice())
    r = requests.post(requestPath, data=jsonData, headers=httpHeaders)
    print('status code:', r.status_code)
    responseJson = r.text
    # print responseJson
    # print "====================================================="


# getSessionToken()
