FROM php:8.2-apache

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install dependencies
RUN apt-get update && apt-get install -y git unzip \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy source code first to preserve structure
COPY src/ /var/www/html/

WORKDIR /var/www/html

# Ensure the uploads/profile_pics directories are created after copying
RUN mkdir -p /var/www/html/uploads/profile_pics \
    && chown -R www-data:www-data /var/www/html/uploads \
    && chmod -R 755 /var/www/html/uploads

# Set ownership and permissions for the entire project
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Install Composer dependencies only if composer.json exists
RUN if [ -f composer.json ]; then composer install; fi

# Configure Apache for uploads directory
RUN echo '<Directory /var/www/html/uploads>\n    Options Indexes FollowSymLinks\n    AllowOverride All\n    Require all denied\n</Directory>' >> /etc/apache2/apache2.conf
