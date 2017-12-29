from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from .models import Memory
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import MemorySerializer
from django.http import HttpResponse

from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import views as auth_views
from django.contrib.auth.models import User

from django.utils import timezone
from datetime import date
from datetime import datetime

# ------------------- HOME -------------------

def index(request):
    if request.user.is_authenticated:
        all_memorys = Memory.objects.filter(author=request.user).order_by('-date')
        context = {'all_memorys': all_memorys}
        return render(request, 'places/base.html', context)
    else:
        return auth_views.login(request)

# ------------------- SIGNUP/LOGIN -------------------

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('index')
    else:
        form = UserCreationForm()
    return render(request, 'registration/signup.html', {'form': form})

def login(request, user):
    data = {
        'all_memorys': Memory.objects.filter(author = request.user).order_by('-date'),
    }
    return auth_views.login(request, data)

def logout(request, user):
    return auth_views.logout(request)

# ------------------- MEMORY VIEWS -------------------

class MemoryCreate(CreateView):
    model = Memory
    model.date = date.today()
    fields = ['city', 'country', 'info', 'date']

    def form_valid(self, form):
        memo = form.save(commit = False)
        memo.author = self.request.user
        return super(MemoryCreate, self).form_valid(form)

    # Getting memos as context
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['all_memorys'] = Memory.objects.filter(author = self.request.user).order_by('-date')
        return context

    template_name = 'places/memory_form.html'


class MemoryUpdate(UpdateView):
    model = Memory
    fields = ['city', 'country', 'info', 'date']

    def form_valid(self, form):
        memo = form.save(commit = False)
        memo.author = self.request.user
        return super(MemoryUpdate, self).form_valid(form)

    # Getting memos as context
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['all_memorys'] = Memory.objects.filter(author = self.request.user).order_by('-date')
        return context

    template_name = 'places/edit_form.html'


class MemoryDelete(DeleteView):
    model = Memory
    success_url = reverse_lazy('index')


class MemoryList(APIView):

    def get(self, request):
        memories = Memory.objects.filter(author=request.user).order_by('-date')
        serializer = MemorySerializer(memories, many=True)
        return Response(serializer.data)

    def post(self):
        pass
