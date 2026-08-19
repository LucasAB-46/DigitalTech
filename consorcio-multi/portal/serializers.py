from rest_framework import serializers
from .models import Notificacion, NotificacionDestinatario, Votacion, OpcionVotacion, Voto

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'

class NotificacionDestinatarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificacionDestinatario
        fields = '__all__'

class VotacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Votacion
        fields = '__all__'

class OpcionVotacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpcionVotacion
        fields = '__all__'

class VotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voto
        fields = '__all__'