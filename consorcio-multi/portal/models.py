from django.db import models
from core.models import Consorcio, Usuario
from cobranzas.models import UnidadFuncional

class Notificacion(models.Model):
    """
    Aviso o comunicado general emitido por la administración.
    """
    consorcio = models.ForeignKey(Consorcio, on_delete=models.CASCADE, related_name='notificaciones')
    titulo = models.CharField(max_length=200)
    mensaje = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.titulo} - {self.consorcio.nombre}"

class NotificacionDestinatario(models.Model):
    """
    Tabla intermedia para saber qué propietario leyó la notificación.
    """
    notificacion = models.ForeignKey(Notificacion, on_delete=models.CASCADE, related_name='destinatarios')
    propietario = models.ForeignKey(Usuario, on_delete=models.CASCADE, limit_choices_to={'rol': 'PROP'})
    leida = models.BooleanField(default=False)
    fecha_lectura = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Aviso para {self.propietario.username} - Leída: {self.leida}"

class Votacion(models.Model):
    """
    Asamblea o encuesta digital para tomar decisiones en el edificio.
    """
    consorcio = models.ForeignKey(Consorcio, on_delete=models.CASCADE, related_name='votaciones')
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    fecha_cierre = models.DateTimeField()
    activa = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.titulo} - {self.consorcio.nombre}"

class OpcionVotacion(models.Model):
    """
    Las distintas opciones disponibles dentro de una votación.
    """
    votacion = models.ForeignKey(Votacion, on_delete=models.CASCADE, related_name='opciones')
    descripcion = models.CharField(max_length=200)
    
    def __str__(self):
        return f"{self.votacion.titulo} - {self.descripcion}"

class Voto(models.Model):
    """
    Registro inmutable del voto emitido por una Unidad Funcional.
    """
    opcion = models.ForeignKey(OpcionVotacion, on_delete=models.CASCADE, related_name='votos')
    unidad_funcional = models.ForeignKey(UnidadFuncional, on_delete=models.CASCADE, related_name='votos_emitidos')
    fecha_voto = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        # Regla de negocio vital: Un departamento solo puede votar una vez en la misma opción/votación
        unique_together = ('opcion', 'unidad_funcional')

    def __str__(self):
        return f"Voto de UF {self.unidad_funcional.numero_uf}"