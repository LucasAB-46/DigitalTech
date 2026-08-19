from rest_framework import serializers
from .models import Consorcio, Usuario, Periodo

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        # Elegimos qué campos del usuario queremos enviar al frontend (ocultamos la contraseña, por supuesto)
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'rol', 'dni', 'telefono']

class ConsorcioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consorcio
        fields = '__all__' # Le decimos que convierta todos los campos del consorcio a JSON

class PeriodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Periodo
        fields = '__all__'