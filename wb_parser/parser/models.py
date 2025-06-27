from django.db import models


class Product(models.Model):
    class Meta:
        verbose_name = "product"
        verbose_name_plural = "products"

    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    sale_price = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    rating = models.FloatField()
    reviews_count = models.IntegerField()

    def __str__(self):
        return self.name
