from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificacionViewSet, NotificacionDestinatarioViewSet, VotacionViewSet, OpcionVotacionViewSet, VotoViewSet

router = DefaultRouter()
router.register(r'avisos', NotificacionViewSet)
router.register(r'lecturas-avisos', NotificacionDestinatarioViewSet)
router.register(r'asambleas', VotacionViewSet)
router.register(r'opciones-asamblea', OpcionVotacionViewSet)
router.register(r'votos-emitidos', VotoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]