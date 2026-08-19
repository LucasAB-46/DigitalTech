from rest_framework import viewsets
from .models import Liquidacion, LiquidacionDetalleUF, LiquidacionSueldo
from .serializers import LiquidacionSerializer, LiquidacionDetalleUFSerializer, LiquidacionSueldoSerializer

class LiquidacionViewSet(viewsets.ModelViewSet):
    queryset = Liquidacion.objects.all()
    serializer_class = LiquidacionSerializer

class LiquidacionDetalleUFViewSet(viewsets.ModelViewSet):
    queryset = LiquidacionDetalleUF.objects.all()
    serializer_class = LiquidacionDetalleUFSerializer

class LiquidacionSueldoViewSet(viewsets.ModelViewSet):
    queryset = LiquidacionSueldo.objects.all()
    serializer_class = LiquidacionSueldoSerializer