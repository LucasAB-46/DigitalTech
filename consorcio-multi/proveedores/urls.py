from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProveedorViewSet, EncargadoViewSet, FacturaViewSet

router = DefaultRouter()
router.register(r'listado', ProveedorViewSet) # Usamos 'listado' para no repetir /proveedores/proveedores/
router.register(r'encargados', EncargadoViewSet)
router.register(r'facturas', FacturaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]