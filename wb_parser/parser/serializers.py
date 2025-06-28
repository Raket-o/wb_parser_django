"""Модуль сериалайзеров (валидация ответа API)."""
from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class PriceHistogramSerializer(serializers.Serializer):
    range = serializers.CharField()
    count = serializers.IntegerField()
