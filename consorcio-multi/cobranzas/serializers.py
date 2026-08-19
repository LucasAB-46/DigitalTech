from rest_framework import serializers
from .models import UnidadFuncional, Pago

class UnidadFuncionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnidadFuncional
        fields = '__all__'

class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = '__all__'