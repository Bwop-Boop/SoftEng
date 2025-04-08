from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('staff', 'Company Staff'),
        ('client', 'Client'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    first_name = models.CharField(max_length=30, blank=True, null=True)  # ✅ Added First Name
    last_name = models.CharField(max_length=30, blank=True, null=True)  # ✅ Added Last Name

    def __str__(self):
        return self.username
