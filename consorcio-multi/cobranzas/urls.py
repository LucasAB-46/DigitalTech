from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UnidadFuncionalViewSet, PagoViewSet

router = DefaultRouter()
router.register(r'unidades-funcionales', UnidadFuncionalViewSet)
router.register(r'pagos', PagoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]