from rest_framework import viewsets
from .models import Consorcio, Usuario, Periodo
from .serializers import ConsorcioSerializer, UsuarioSerializer, PeriodoSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class ConsorcioViewSet(viewsets.ModelViewSet):
    queryset = Consorcio.objects.all()
    serializer_class = ConsorcioSerializer

class PeriodoViewSet(viewsets.ModelViewSet):
    queryset = Periodo.objects.all()
    serializer_class = PeriodoSerializer