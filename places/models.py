from django.db import models
from django.urls import reverse
from django.utils import timezone
from datetime import date

# Create your models here.
class Memory(models.Model):
    author = models.ForeignKey('auth.User', on_delete = models.CASCADE)
    city = models.CharField(max_length=250)
    country = models.CharField(max_length=250)
    info = models.TextField(default='')
    date = models.DateField(default=date.today)

    def get_absolute_url(self):
        return reverse('index')

    def __str__(self):
        return self.city + " - " + self.country
