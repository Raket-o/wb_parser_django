"""Модуль конфиг для проверки создано ли окружение."""
import os

from dotenv import find_dotenv, get_cli_string, load_dotenv

get_cli_string(path="../.env")

if not find_dotenv():
    exit("Переменные окружения не загружены т.к отсутствует файл .env")
else:
    load_dotenv()

db_user = os.getenv("DB_USER") if os.getenv("DB_USER") else "admin"
db_password = os.getenv("DB_PASSWORD") if os.getenv("DB_PASSWORD") else "admin"
db_host = os.getenv("DB_HOST") if os.getenv("DB_HOST") else "192.168.55.4"
db_port = os.getenv("DB_PORT") if os.getenv("DB_PORT") else "5432"
db_name = os.getenv("DB_NAME") if os.getenv("DB_NAME") else "new_db_project"
debug = os.getenv("DEBUG").capitalize() if os.getenv("DEBUG") else "False"
log_level = os.getenv("LOG_LEVEL").upper() if os.getenv("LOG_LEVEL") else "INFO"
url_app = os.getenv("URL_APP")
