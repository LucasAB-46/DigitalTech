from django.contrib import admin
from .models import Notificacion, NotificacionDestinatario, Votacion, OpcionVotacion, Voto

class NotificacionDestinatarioInline(admin.TabularInline):
    model = NotificacionDestinatario
    extra = 0 # No agrega filas extra vacías

@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'consorcio', 'fecha_creacion')
    list_filter = ('consorcio',)
    search_fields = ('titulo', 'mensaje')
    inlines = [NotificacionDestinatarioInline]

class OpcionVotacionInline(admin.TabularInline):
    model = OpcionVotacion
    extra = 2 # Muestra por defecto 2 campos para cargar opciones ("Sí", "No", etc.)

@admin.register(Votacion)
class VotacionAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'consorcio', 'fecha_cierre', 'activa')
    list_filter = ('consorcio', 'activa')
    inlines = [OpcionVotacionInline]

@admin.register(Voto)
class VotoAdmin(admin.ModelAdmin):
    list_display = ('unidad_funcional', 'opcion', 'fecha_voto')
    list_filter = ('opcion__votacion__consorcio', 'opcion__votacion')