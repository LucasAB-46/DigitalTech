from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LiquidacionViewSet, LiquidacionDetalleUFViewSet, LiquidacionSueldoViewSet

router = DefaultRouter()
router.register(r'cabeceras', LiquidacionViewSet)
router.register(r'detalles-uf', LiquidacionDetalleUFViewSet)
router.register(r'sueldos', LiquidacionSueldoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]