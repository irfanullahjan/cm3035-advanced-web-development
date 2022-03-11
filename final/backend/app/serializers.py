from rest_framework import serializers
from django.contrib.auth import get_user_model  # If used custom user model
from .models import *

UserModel = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    def create(self, validated_data):

        user = UserModel.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        return user

    class Meta:
        model = UserModel
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):

    user_id = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault())

    username = serializers.CharField(source='user_id.username', read_only=True)

    class Meta:
        model = Post
        fields = '__all__'
