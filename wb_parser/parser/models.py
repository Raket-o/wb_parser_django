"""Модуль с моделями для БД."""
from django.db import models
from django.db.models import CharField


class Product(models.Model):
    class Meta:
        verbose_name = "product"
        verbose_name_plural = "products"

    name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=6, decimal_places=0, db_index=True)
    discount_price = models.DecimalField(max_digits=6, decimal_places=0, null=True, blank=True)
    rating = models.FloatField()
    feedback_counts = models.IntegerField()
    wb_id = models.BigIntegerField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.name}, {self.price}"
