FROM php:8.2-apache

RUN a2enmod rewrite

COPY src/ /var/www/html/

WORKDIR /var/www/html

RUN docker-php-ext-install pdo pdo_mysql

