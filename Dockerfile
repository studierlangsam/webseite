FROM httpd:2.4.62-alpine
COPY build /var/www/
COPY httpd.conf /etc/httpd-extra.conf
RUN cat /etc/httpd-extra.conf >> /usr/local/apache2/conf/httpd.conf \
 && sed -i '/CustomLog .*/d' /usr/local/apache2/conf/httpd.conf \
 && rm /etc/httpd-extra.conf
