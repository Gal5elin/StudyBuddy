FROM php:8.2-apache

RUN a2enmod rewrite

COPY src/ /var/www/html/

WORKDIR /var/www/html

RUN docker-php-ext-install pdo pdo_mysql

RUN chown -R www-data:www-data /var/www/html/uploads
RUN chmod -R 755 /var/www/html/uploads

RUN echo '<Directory /var/www/html/uploads>\n    Options Indexes FollowSymLinks\n    AllowOverride All\n    Require all granted\n</Directory>' >> /etc/apache2/apache2.conf