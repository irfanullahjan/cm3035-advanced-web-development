from django.db import models
from django.contrib.auth import get_user_model

# Posts model
class Post(models.Model):
    body = models.TextField(null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user_id = models.ForeignKey('auth.User', on_delete=models.CASCADE)

    def __str__(self):
        return self.title

# User's Profile model
class Profile(models.Model):
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    friends = models.ManyToManyField('self', blank=True)
    birthday = models.DateField(null=False, blank=False)

    def __str__(self):
        return self.user.username