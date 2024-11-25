FROM php:8.2-apache

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install dependencies and Composer
RUN apt-get update && apt-get install -y git unzip \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy your project files
COPY src/ /var/www/html/

WORKDIR /var/www/html

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Install Composer dependencies
RUN composer install

# Set permissions for uploads directory
RUN chown -R www-data:www-data /var/www/html/uploads
RUN chmod -R 755 /var/www/html/uploads

# Configure Apache for uploads directory
RUN echo '<Directory /var/www/html/uploads>\n    Options Indexes FollowSymLinks\n    AllowOverride All\n    Require all denied\n</Directory>' >> /etc/apache2/apache2.conf

RUN composer install