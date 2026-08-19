from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Consorcio, AdministradorConsorcio, Periodo

# Registramos el modelo Usuario extendiendo la vista por defecto de Django
@admin.register(Usuario)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'rol', 'dni')
    # Agregamos nuestros campos personalizados al formulario del admin
    fieldsets = UserAdmin.fieldsets + (
        ('Datos Extra de Consorcio Up', {'fields': ('rol', 'dni', 'cuil', 'telefono')}),
    )

@admin.register(Consorcio)
class ConsorcioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'cuit_consorcio', 'activo', 'fecha_alta')
    search_fields = ('nombre', 'cuit_consorcio')
    list_filter = ('activo',)

@admin.register(AdministradorConsorcio)
class AdministradorConsorcioAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'consorcio', 'fecha_asignacion', 'activo')
    list_filter = ('activo', 'consorcio')

@admin.register(Periodo)
class PeriodoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'consorcio', 'fecha_inicio', 'activo')
    list_filter = ('consorcio', 'activo')