from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConsorcioViewSet, UsuarioViewSet, PeriodoViewSet

# El DefaultRouter es una herramienta genial de DRF que crea automáticamente
# todas las rutas necesarias para el CRUD (GET, POST, PUT, DELETE)
router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'consorcios', ConsorcioViewSet)
router.register(r'periodos', PeriodoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]