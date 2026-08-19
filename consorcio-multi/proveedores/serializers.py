from rest_framework import serializers
from .models import Proveedor, Encargado, Factura

class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = '__all__'

class EncargadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Encargado
        fields = '__all__'

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = '__all__'