from django.db import models
from core.models import Consorcio, Periodo

class Proveedor(models.Model):
    """
    Persona física o jurídica que presta servicios a los edificios.
    """
    razon_social = models.CharField(max_length=200)
    cuit = models.CharField(max_length=13, unique=True)
    tipo_servicio = models.CharField(max_length=100) # Ej: Plomería, Ascensores, Limpieza
    email = models.EmailField(max_length=200)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    activo = models.BooleanField(default=True)
    fecha_alta = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.razon_social} ({self.tipo_servicio})"


class Encargado(models.Model):
    """
    Personal en relación de dependencia del consorcio (SUTERH).
    """
    consorcio = models.ForeignKey(Consorcio, on_delete=models.CASCADE, related_name='encargados')
    nombre = models.CharField(max_length=150)
    apellido = models.CharField(max_length=100)
    dni = models.CharField(max_length=8, unique=True)
    cuil = models.CharField(max_length=13, unique=True)
    categoria_suterh = models.CharField(max_length=50)
    sueldo_basico = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_ingreso = models.DateField()
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.apellido}, {self.nombre} - {self.consorcio.nombre}"


class Factura(models.Model):
    """
    Comprobante que registra un gasto realizado por el consorcio en un período.
    """
    TIPO_GASTO_CHOICES = [
        ('ORDINARIO', 'Ordinario'),
        ('EXTRAORDINARIO', 'Extraordinario'),
        ('RESERVA', 'Fondo de Reserva'),
    ]
    
    consorcio = models.ForeignKey(Consorcio, on_delete=models.CASCADE, related_name='facturas')
    proveedor = models.ForeignKey(Proveedor, on_delete=models.RESTRICT, related_name='facturas')
    periodo = models.ForeignKey(Periodo, on_delete=models.RESTRICT, related_name='facturas')
    
    numero_factura = models.CharField(max_length=50)
    fecha_factura = models.DateField()
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    tipo_gasto = models.CharField(max_length=20, choices=TIPO_GASTO_CHOICES)
    archivo_url = models.URLField(max_length=500, blank=True, null=True) # Link al PDF o imagen
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Fac {self.numero_factura} - {self.proveedor.razon_social} (${self.monto})"