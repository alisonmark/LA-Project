from django.conf.urls import url
 
from . import views
 
urlpatterns = [
    # ex: /polls/
    # url(r'^session.json/$', views.SessionDetailUpdateAPIView,name=None),
    url(r'^(?P<authKey>[a-z A-Z 0-9]+)/$', views.detail, name='detail'),]
    # # ex: /polls/5/
    # url(r'^(?P<question_id>[0-9]+)/$', views.detail, name='detail'),
    # # ex: /polls/5/results/
    # url(r'^(?P<question_id>[0-9]+)/results/$', views.results, name='results'),
    # # ex: /polls/5/vote/
    # url(r'^(?P<question_id>[0-9]+)/vote/$', views.vote, name='vote'),