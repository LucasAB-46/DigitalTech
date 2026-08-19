from rest_framework import serializers
from .models import Liquidacion, LiquidacionDetalleUF, LiquidacionSueldo

class LiquidacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Liquidacion
        fields = '__all__'

class LiquidacionDetalleUFSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiquidacionDetalleUF
        fields = '__all__'

class LiquidacionSueldoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiquidacionSueldo
        fields = '__all__'