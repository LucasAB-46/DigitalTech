from django.db import models
from core.models import Consorcio, Usuario, Periodo
import uuid

class UnidadFuncional(models.Model):
    """
    Representa un departamento o unidad dentro de un consorcio.
    """
    consorcio = models.ForeignKey(Consorcio, on_delete=models.CASCADE, related_name='unidades_funcionales')
    
    # El propietario puede ser nulo inicialmente hasta que se asigne a alguien
    propietario = models.ForeignKey(
        Usuario, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        limit_choices_to={'rol': 'PROP'},
        related_name='propiedades'
    )
    
    numero_uf = models.CharField(max_length=10) # Ej: 1A, 2B, PB1
    piso = models.CharField(max_length=10, null=True, blank=True)
    coeficiente = models.DecimalField(max_digits=5, decimal_places=4) # Ej: 0.0450
    
    # Generamos el código único para Mercado Pago u otras pasarelas
    codigo_referencia = models.CharField(max_length=50, unique=True, blank=True)
    activo = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        # Si no tiene código de referencia al crearse, le asignamos uno aleatorio y único
        if not self.codigo_referencia:
            self.codigo_referencia = str(uuid.uuid4()).split('-')[0].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"UF {self.numero_uf} - {self.consorcio.nombre}"


class Pago(models.Model):
    """
    Registro de transacciones monetarias de las unidades funcionales.
    """
    TIPO_PAGO_CHOICES = [
        ('TOTAL', 'Total'),
        ('PARCIAL', 'Parcial'),
    ]
    
    unidad_funcional = models.ForeignKey(UnidadFuncional, on_delete=models.RESTRICT, related_name='pagos')
    periodo = models.ForeignKey(Periodo, on_delete=models.RESTRICT, related_name='pagos')
    
    monto_pagado = models.DecimalField(max_digits=10, decimal_places=2)
    saldo_pendiente = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tipo_pago = models.CharField(max_length=10, choices=TIPO_PAGO_CHOICES)
    
    fecha_pago = models.DateTimeField(auto_now_add=True)
    id_transaccion_pasarela = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"Pago {self.id_transaccion_pasarela} - UF {self.unidad_funcional.numero_uf}"