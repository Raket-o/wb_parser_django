FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /wb_parser

COPY requirements.txt requirements.txt

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

COPY .env .

COPY wb_parser .
