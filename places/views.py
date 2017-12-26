from django.shortcuts import render
from django.shortcuts import get_object_or_404
from .models import Memory
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import MemorySerializer
from django.http import HttpResponse

# handles all the view requests
def index(request):
    all_memorys = Memory.objects.all()
    context = {'all_memorys': all_memorys}
    return render(request, 'places/base.html', context)

class MemoryCreate(CreateView):
    model = Memory
    fields = ['city', 'country', 'info']

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['all_memorys'] = Memory.objects.all()
        return data

    template_name = 'places/memory_form.html'

class MemoryUpdate(UpdateView):
    model = Memory
    fields = ['city', 'country', 'info']

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['all_memorys'] = Memory.objects.all()
        return data

    template_name = 'places/edit_form.html'

class MemoryDelete(DeleteView):
    model = Memory
    success_url = reverse_lazy('index')

class MemoryList(APIView):

    def get(self, request):
        memories = Memory.objects.all()
        serializer = MemorySerializer(memories, many=True)
        return Response(serializer.data)

    def post(self):
        pass
