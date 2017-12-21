from rest_framework import serializers
from .models import Memory

class MemorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Memory
        fields = '__all__'
