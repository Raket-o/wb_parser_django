"""Модуль парсинга."""
import requests

from parser.models import Product


HEADERS = {"User-Agent": "Chrome/137.0.0.0"}


def request_products(query: str):
    """
    Функция принимает текст, делает по нему запрос на валдберис,
    парсит ответ и сохраняет товары в БД.
    """
    url = f"https://search.wb.ru/exactmatch/ru/common/v4/search"
    params = {
        "query": query,
        "appType": 1,
        "curr": "rub",
        "dest": -1257786,
        "regions": "63",
        "spp": 30,
        "resultset": "catalog",
        "sort": "popular",
        "page": 1,
        "limit": 100,
    }

    response = requests.get(url, headers=HEADERS, params=params, timeout=5)
    response.raise_for_status()
    data = response.json()

    products = ()
    for item in data.get("data", {}).get("products", []):
        product = Product(
            name=item.get("name"),
            price=item.get("priceU") // 100,
            discount_price=item.get("salePriceU", 0) // 100,
            rating=item.get("reviewRating"),
            feedback_counts=item.get("feedbacks"),
            wb_id=item.get("id"),
        )
        products += (product,)

    Product.objects.all().delete()
    Product.objects.bulk_create(products)
