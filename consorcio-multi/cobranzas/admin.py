from django.contrib import admin
from .models import UnidadFuncional, Pago

@admin.register(UnidadFuncional)
class UnidadFuncionalAdmin(admin.ModelAdmin):
    list_display = ('numero_uf', 'consorcio', 'propietario', 'coeficiente', 'codigo_referencia', 'activo')
    list_filter = ('consorcio', 'activo')
    # Permite buscar por nro de depto, nombre del consorcio o nombre del propietario
    search_fields = ('numero_uf', 'consorcio__nombre', 'propietario__username')

@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = ('id_transaccion_pasarela', 'unidad_funcional', 'periodo', 'monto_pagado', 'tipo_pago', 'fecha_pago')
    # Filtros laterales muy útiles para buscar pagos de un consorcio o periodo específico
    list_filter = ('tipo_pago', 'periodo', 'unidad_funcional__consorcio')
    search_fields = ('id_transaccion_pasarela', 'unidad_funcional__numero_uf')
    
    # Protegemos la fecha de pago para que no sea editable manualmente
    readonly_fields = ('fecha_pago',)