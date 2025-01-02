# Use the PHP 8.2 Apache base image
FROM php:8.2-apache

# Enable Apache mod_rewrite for pretty URLs
RUN a2enmod rewrite

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libgd-dev \
    libmagickwand-dev \
    && pecl install imagick \
    && docker-php-ext-enable imagick \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip \
    && apt-get clean

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy source code into the container
COPY src/ /var/www/html/

# Set the working directory
WORKDIR /var/www/html

# Ensure uploads/profile_pics directories are created with proper permissions
RUN mkdir -p /var/www/html/uploads/profile_pics \
    && chown -R www-data:www-data /var/www/html/uploads \
    && chmod -R 755 /var/www/html/uploads

# Set ownership and permissions for the entire project
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql bcmath

# Install Composer dependencies if composer.json exists
RUN if [ -f composer.json ]; then composer install; fi

# Configure Apache for the uploads directory to restrict access
RUN echo '<Directory /var/www/html/uploads>\n    Options -Indexes +FollowSymLinks\n    AllowOverride None\n    Require all denied\n</Directory>' >> /etc/apache2/apache2.conf

# Fix pdf conversion premission
RUN sed -i '/<\/policymap>/i <policy domain="coder" rights="read | write" pattern="PDF" />' /etc/ImageMagick-6/policy.xml
