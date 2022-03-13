from rest_framework import serializers
from django.contrib.auth import get_user_model  # If used custom user model
from .models import *

UserModel = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):

    birthday = serializers.DateField(format="%Y-%m-%d")

    # setting to read only to pass validation coz user will be poppulated once created
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    profile = ProfileSerializer()

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = UserModel.objects.create(**validated_data)
        Profile.objects.create(user=user, **profile_data)
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
