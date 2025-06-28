"""Модуль обработки эндпоинтов."""
from django.db.models import Min, Max
from django.views.generic import ListView
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet

from .filters import ProductFilter
from .models import Product
from .serializers import ProductSerializer, PriceHistogramSerializer
from .utils.wb_parser import request_products


class ProductList(ListView):
    model = Product
    template_name = "index.html"
    queryset = Product.objects.order_by("price")
    filterset_class = ProductFilter
    paginate_by = 15

    def get_paginate_by(self, queryset) -> None:
        return self.request.GET.get("paginate_by", self.paginate_by)

    def get_ordering(self) -> str:
        ordering = self.request.GET.get("order_by", "price")
        de_asd = self.request.GET.get("sort_order", "asc")
        if de_asd == "asc":
            return f"-{ordering}"
        return f"{ordering}"

    def post(self, request, *args, **kwargs):
        text_query = request.POST.get("query", None)
        if text_query is not None:
            request_products(text_query)
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()
        self.filterset = self.filterset_class(self.request.GET, queryset=queryset)
        return self.filterset.qs.distinct()

    def get_context_data(self, **kwargs) -> dict:
        min_price = Product.objects.aggregate(Min("price"))
        max_price = Product.objects.aggregate(Max("price"))
        max_rating = Product.objects.aggregate(Max("rating"))
        min_feedback_counts = Product.objects.aggregate(Min("feedback_counts"))
        max_feedback_counts = Product.objects.aggregate(Max("feedback_counts"))

        context = super(ListView, self).get_context_data(**kwargs)
        context["filterset"] = self.filterset
        context.update(
            {
                "min_price": min_price.get("price__min"),
                "max_price": max_price.get("price__max"),
                "max_rating": max_rating.get("rating__max"),
                "min_feedback_counts": min_feedback_counts.get("feedback_counts__min"),
                "max_feedback_counts": max_feedback_counts.get("feedback_counts__max"),
            }
        )
        return context


class PriceHistogramViewSet(ViewSet):
    http_method_names = ("get",)
    queryset = Product.objects.all()
    serializer_class = PriceHistogramSerializer

    def list(self, request):
        top_price = Product.objects.aggregate(Max("price")).get("price__max")
        min_price = request.GET.get("min_price", 0)
        max_price = request.GET.get("max_price", top_price)
        rating = request.GET.get("min_rating", 0)
        feedback_counts = request.GET.get("min_feedback_counts", 0)

        products = Product.objects.all().filter(
            rating__gte=rating, feedback_counts__gte=feedback_counts
        )
        data = calculate_histogram(products, min_price, max_price)

        serializer = PriceHistogramSerializer(data, many=True)
        return Response(serializer.data)


class ProductViewSet(ModelViewSet):
    http_method_names = ("get",)
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = (
        DjangoFilterBackend,
        OrderingFilter,
    )
    filterset_class = ProductFilter

    ordering_fields = [
        "name",
        "price",
        "rating",
        "feedback_counts",
    ]


def calculate_histogram(prices, min_price=None, max_price=None) -> list:
    ranges = [
        ("0-1000", lambda x: 0 <= x <= 1000),
        ("1001-2000", lambda x: 1001 <= x <= 2000),
        ("2001-3000", lambda x: 2001 <= x <= 3000),
        ("3001-4000", lambda x: 3001 <= x <= 4000),
        ("4001-5000", lambda x: 4001 <= x <= 5000),
        ("5001-10000", lambda x: 5001 <= x <= 10000),
    ]

    filtered_prices = prices.filter(price__gte=min_price).filter(price__lte=max_price)

    result = []
    for range_name, condition in ranges:
        count = sum(condition(p.price) for p in filtered_prices if condition(p.price))
        result.append({"range": range_name, "count": count})

    return result
