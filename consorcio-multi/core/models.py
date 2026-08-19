from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    ROL_ADMINISTRADOR = 'ADMIN'
    ROL_PROPIETARIO = 'PROP'
    
    ROLES = [
        (ROL_ADMINISTRADOR, 'Administrador'),
        (ROL_PROPIETARIO, 'Propietario'),
    ]
    
    rol = models.CharField(max_length=5, choices=ROLES, default=ROL_PROPIETARIO)
    dni = models.CharField(max_length=8, unique=True, null=True, blank=True)
    cuil = models.CharField(max_length=13, null=True, blank=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.get_rol_display()})"


class Consorcio(models.Model):
    nombre = models.CharField(max_length=150)
    direccion = models.CharField(max_length=255)
    cuit_consorcio = models.CharField(max_length=13)
    activo = models.BooleanField(default=True)
    fecha_alta = models.DateField(auto_now_add=True)

    administradores = models.ManyToManyField(
        Usuario, 
        through='AdministradorConsorcio',
        related_name='consorcios_asignados'
    )

    def __str__(self):
        return f"{self.nombre} ({self.cuit_consorcio})"


class AdministradorConsorcio(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, limit_choices_to={'rol': 'ADMIN'})
    consorcio = models.ForeignKey(Consorcio, on_delete=models.CASCADE)
    fecha_asignacion = models.DateField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    class Meta:
        unique_together = ('usuario', 'consorcio')

    def __str__(self):
        return f"{self.usuario.username} -> {self.consorcio.nombre}"


class Periodo(models.Model):
    consorcio = models.ForeignKey(Consorcio, on_delete=models.CASCADE, related_name='periodos')
    nombre = models.CharField(max_length=150)
    fecha_inicio = models.DateField()
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} - {self.consorcio.nombre}"