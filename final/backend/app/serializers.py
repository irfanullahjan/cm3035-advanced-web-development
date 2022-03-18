from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import *

class ProfileSerializer(serializers.ModelSerializer):

    birthday = serializers.DateField(format="%Y-%m-%d")

    # setting to read only to pass validation coz user will be poppulated once created
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'

class FriendRequestSerializer(serializers.ModelSerializer):

    sender = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = FriendRequest
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    profile = ProfileSerializer()

    friend_requests_received = FriendRequestSerializer(many=True, read_only=True)

    friend_requests_sent = FriendRequestSerializer(many=True, read_only=True)

    def validate_password(self, value):
        return make_password(value)

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create(**validated_data)
        Profile.objects.create(user=user, **profile_data)
        return user

    class Meta:
        model = User
        fields = '__all__'

class UserSerializerRestricted(serializers.ModelSerializer):
    
        class Meta:
            model = User
            fields = ('id', 'username', 'first_name', 'last_name', 'email')


class PostSerializer(serializers.ModelSerializer):

    user = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault())

    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Post
        fields = '__all__'
