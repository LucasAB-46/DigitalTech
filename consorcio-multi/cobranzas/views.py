from rest_framework import viewsets
from .models import UnidadFuncional, Pago
from .serializers import UnidadFuncionalSerializer, PagoSerializer

class UnidadFuncionalViewSet(viewsets.ModelViewSet):
    queryset = UnidadFuncional.objects.all()
    serializer_class = UnidadFuncionalSerializer

class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer