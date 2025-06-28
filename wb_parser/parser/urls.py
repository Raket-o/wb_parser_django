"""Модуль для связывания URL и функций."""
from django.urls import path
from django.views.decorators.cache import cache_page
from wb_parser.settings import CACHE_SECONDS
from .views import ProductList

app_name = "parser"

urlpatterns = [
    path("", cache_page(CACHE_SECONDS)(ProductList.as_view()), name="products_list"),
]
