"""Модуль кастомных фильтров."""
import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    min_rating = django_filters.NumberFilter(field_name="rating", lookup_expr="gte")
    min_feedback_counts = django_filters.NumberFilter(
        field_name="feedback_counts", lookup_expr="gte"
    )

    class Meta:
        model = Product
        fields = []
