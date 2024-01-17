FROM  nginx:stable-alpine3.17-slim
LABEL  author="WCL <support@wclsolution.com>"

# Copy Nginx configuration files
COPY docker/config/fastcgi_params /etc/nginx/fastcgi_params
COPY docker/config/fastcgi.conf /etc/nginx/fastcgi.conf
COPY docker/config/mime.types /etc/nginx/mime.types
COPY docker/config/modules /etc/nginx/modules
COPY docker/config/nginx.conf /etc/nginx/nginx.conf
COPY docker/config/scgi_params /etc/nginx/scgi_params
COPY docker/config/uwsgi_params /etc/nginx/uwsgi_params
COPY docker/config/conf.d/admin.conf /etc/nginx/conf.d/admin.conf
COPY docker/config/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY docker/config/conf.d/public.conf /etc/nginx/conf.d/public.conf
COPY docker/config/conf.d/resources.conf /etc/nginx/conf.d/resources.conf

# Create the application
COPY admin.tar.gz /tmp/admin.tar.gz
COPY client.tar.gz /tmp/client.tar.gz
COPY public.tar.gz /tmp/public.tar.gz
COPY pdfjs.tar.gz /tmp/pdfjs.tar.gz

RUN mkdir -p /usr/share/nginx/html/admin \
             /usr/share/nginx/html/client \
             /usr/share/nginx/html/public \
             /usr/share/nginx/html/resources/pdfjs
RUN tar xzfv /tmp/admin.tar.gz --strip-components=1 -C /usr/share/nginx/html/admin
RUN tar xzfv /tmp/client.tar.gz --strip-components=1 -C /usr/share/nginx/html/client
RUN tar xzfv /tmp/public.tar.gz --strip-components=1 -C /usr/share/nginx/html/public
RUN tar xzfv /tmp/pdfjs.tar.gz --strip-components=1 -C /usr/share/nginx/html/resources/pdfjs

RUN rm /tmp/admin.tar.gz \
       /tmp/client.tar.gz \
       /tmp/public.tar.gz \
       /tmp/pdfjs.tar.gz
 
ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 80

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
