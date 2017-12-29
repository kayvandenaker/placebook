"""placebook URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
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
from . import views
from .models import Memory

from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import views as auth_views
from django.contrib.auth.models import User

urlpatterns = [
    path('', views.index, name='index'),
    #/places/add/
    path('add/', views.MemoryCreate.as_view(), name='memory-add'),
    #/places/<pk>/edit/ --> to edit the card
    path('<pk>/edit', views.MemoryUpdate.as_view(), name='memory-update'),
    #/places/<pk>/delete/ --> to edit the card
    path('<pk>/delete/', views.MemoryDelete.as_view(), name='memory-delete'),
    #/registration/login/
    path('login/', auth_views.login, name='login'),
    #/registration/signup/
    path('signup/', views.signup, name='signup'),
    #Logout
    path('logout/', auth_views.logout,{'next_page': 'index'}, name='logout'),
]
