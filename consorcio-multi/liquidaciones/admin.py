from django.contrib import admin
from .models import Liquidacion, LiquidacionDetalleUF, LiquidacionSueldo

# Inline para ver el detalle de cada UF dentro de la misma pantalla de la Liquidación
class LiquidacionDetalleUFInline(admin.TabularInline):
    model = LiquidacionDetalleUF
    extra = 0 # No mostrar filas vacías por defecto
    readonly_fields = ('unidad_funcional', 'total_a_pagar') # Protegemos datos críticos

@admin.register(Liquidacion)
class LiquidacionAdmin(admin.ModelAdmin):
    list_display = ('consorcio', 'periodo', 'estado', 'total_ordinario', 'fecha_emision')
    list_filter = ('estado', 'consorcio', 'periodo')
    search_fields = ('consorcio__nombre', 'periodo__nombre')
    inlines = [LiquidacionDetalleUFInline] # Agrega la tabla de detalles abajo

@admin.register(LiquidacionDetalleUF)
class LiquidacionDetalleUFAdmin(admin.ModelAdmin):
    list_display = ('unidad_funcional', 'liquidacion', 'total_a_pagar')
    list_filter = ('liquidacion__consorcio', 'liquidacion__periodo')
    search_fields = ('unidad_funcional__numero_uf', 'liquidacion__consorcio__nombre')

@admin.register(LiquidacionSueldo)
class LiquidacionSueldoAdmin(admin.ModelAdmin):
    list_display = ('encargado', 'periodo', 'sueldo_neto', 'f931_generado', 'fecha_liquidacion')
    list_filter = ('f931_generado', 'periodo', 'encargado__consorcio')
    search_fields = ('encargado__apellido', 'encargado__dni')