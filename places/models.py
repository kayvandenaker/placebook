from django.db import models
from django.urls import reverse

# Create your models here.
class Memory(models.Model):
    city = models.CharField(max_length=250)
    country = models.CharField(max_length=250)
    info = models.TextField()

    def get_absolute_url(self):
        return reverse('index')

    def __str__(self):
        return self.city + " - " + self.country
