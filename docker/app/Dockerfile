FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
      apt-utils \
      libpq-dev \
      libpng-dev \
      libzip-dev \
      zip unzip \
      git \
      supervisor && \
      docker-php-ext-install pdo_mysql && \
      docker-php-ext-install bcmath && \
      docker-php-ext-install gd && \
      docker-php-ext-install zip && \
      apt-get clean && \
      rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
&& apt-get install -y nodejs

WORKDIR /var/www/html

COPY start-container /usr/local/bin/start-container
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY php.ini /etc/php/8.2/cli/conf.d/99-app.ini
COPY php.ini /etc/php/8.2/fpm/conf.d/99-app.ini
COPY php-fpm.conf /etc/php/8.2/fpm/php-fpm.conf

# # Add files from binstage
# COPY --from=builder /usr/local/bin/* /usr/local/bin/
# COPY --from=builder /usr/local/lib/* /usr/local/lib/
# COPY --from=builder /usr/local/sbin/* /usr/local/sbin/

ENV COMPOSER_ALLOW_SUPERUSER=1
RUN curl -sS https://getcomposer.org/installer | php -- \
    --filename=composer \
    --install-dir=/usr/local/bin

RUN ldconfig \
    && chmod +x /usr/local/bin/start-container

EXPOSE 9000

ENTRYPOINT ["start-container"]


