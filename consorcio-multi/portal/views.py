from rest_framework import viewsets
from .models import Notificacion, NotificacionDestinatario, Votacion, OpcionVotacion, Voto
from .serializers import NotificacionSerializer, NotificacionDestinatarioSerializer, VotacionSerializer, OpcionVotacionSerializer, VotoSerializer

class NotificacionViewSet(viewsets.ModelViewSet):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer

class NotificacionDestinatarioViewSet(viewsets.ModelViewSet):
    queryset = NotificacionDestinatario.objects.all()
    serializer_class = NotificacionDestinatarioSerializer

class VotacionViewSet(viewsets.ModelViewSet):
    queryset = Votacion.objects.all()
    serializer_class = VotacionSerializer

class OpcionVotacionViewSet(viewsets.ModelViewSet):
    queryset = OpcionVotacion.objects.all()
    serializer_class = OpcionVotacionSerializer

class VotoViewSet(viewsets.ModelViewSet):
    queryset = Voto.objects.all()
    serializer_class = VotoSerializer