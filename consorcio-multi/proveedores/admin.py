from django.contrib import admin
from .models import Proveedor, Encargado, Factura

@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ('razon_social', 'cuit', 'tipo_servicio', 'activo')
    search_fields = ('razon_social', 'cuit')
    list_filter = ('tipo_servicio', 'activo')

@admin.register(Encargado)
class EncargadoAdmin(admin.ModelAdmin):
    list_display = ('apellido', 'nombre', 'consorcio', 'categoria_suterh', 'sueldo_basico', 'activo')
    search_fields = ('apellido', 'dni', 'consorcio__nombre')
    list_filter = ('consorcio', 'categoria_suterh')

@admin.register(Factura)
class FacturaAdmin(admin.ModelAdmin):
    list_display = ('numero_factura', 'proveedor', 'consorcio', 'periodo', 'tipo_gasto', 'monto')
    search_fields = ('numero_factura', 'proveedor__razon_social', 'consorcio__nombre')
    # Permite filtrar facturas por edificio, por mes o si son ordinarias/extraordinarias
    list_filter = ('consorcio', 'periodo', 'tipo_gasto', 'proveedor')