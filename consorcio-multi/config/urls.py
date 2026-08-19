from django.contrib import admin
from django.urls import path, include
# Importamos las vistas que nos da la librería para generar tokens
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# Importamos las vistas de Swagger
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),

    # --- RUTAS DE AUTENTICACIÓN (LOGIN) ---
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # --- RUTAS DE SWAGGER ---
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'), # El JSON crudo
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'), # La interfaz gráfica
    
    # Rutas de la API
    path('api/core/', include('core.urls')),
    path('api/cobranzas/', include('cobranzas.urls')),
    path('api/proveedores/', include('proveedores.urls')),
    path('api/liquidaciones/', include('liquidaciones.urls')),
    path('api/portal/', include('portal.urls')),
]