from django.db import models
from core.models import Consorcio, Periodo
from cobranzas.models import UnidadFuncional
from proveedores.models import Encargado

class Liquidacion(models.Model):
    """
    Cabecera que agrupa el cierre mensual de gastos de un consorcio.
    """
    ESTADO_CHOICES = [
        ('BORRADOR', 'Borrador'),
        ('APROBADA', 'Aprobada'),
    ]
    
    consorcio = models.ForeignKey(Consorcio, on_delete=models.RESTRICT, related_name='liquidaciones')
    periodo = models.ForeignKey(Periodo, on_delete=models.RESTRICT, related_name='liquidaciones')
    
    # Totales del edificio en ese mes
    total_ordinario = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_extraordinario = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_fondo_reserva = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    fecha_emision = models.DateField(auto_now_add=True)
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default='BORRADOR')

    def __str__(self):
        return f"Liquidación {self.periodo.nombre} - {self.consorcio.nombre}"


class LiquidacionDetalleUF(models.Model):
    """
    El detalle exacto de cuánto le toca pagar a cada departamento.
    """
    liquidacion = models.ForeignKey(Liquidacion, on_delete=models.CASCADE, related_name='detalles')
    unidad_funcional = models.ForeignKey(UnidadFuncional, on_delete=models.RESTRICT, related_name='liquidaciones_uf')
    
    # Lo que paga esta UF específica según su coeficiente
    importe_ordinario = models.DecimalField(max_digits=10, decimal_places=2)
    importe_extraordinario = models.DecimalField(max_digits=10, decimal_places=2)
    importe_fondo_reserva = models.DecimalField(max_digits=10, decimal_places=2)
    
    total_a_pagar = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Detalle UF {self.unidad_funcional.numero_uf} - {self.liquidacion.periodo.nombre}"


class LiquidacionSueldo(models.Model):
    """
    Registro del sueldo mensual del encargado para el SUTERH y el F931.
    """
    encargado = models.ForeignKey(Encargado, on_delete=models.RESTRICT, related_name='liquidaciones_sueldo')
    periodo = models.ForeignKey(Periodo, on_delete=models.RESTRICT, related_name='liquidaciones_sueldo')
    
    sueldo_bruto = models.DecimalField(max_digits=10, decimal_places=2)
    aportes_retenciones = models.DecimalField(max_digits=10, decimal_places=2)
    sueldo_neto = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Checkbox para saber si ya generamos el archivo para AFIP
    f931_generado = models.BooleanField(default=False)
    fecha_liquidacion = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Sueldo {self.encargado.apellido} - {self.periodo.nombre}"