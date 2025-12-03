FROM alpine:latest

RUN apk add --no-cache mysql-client bash curl tzdata

RUN cp /usr/share/zoneinfo/America/Lima /etc/localtime

COPY backup.sh /backup.sh
RUN chmod +x /backup.sh

COPY crontab.txt /etc/crontabs/root

CMD ["crond", "-f", "-l", "2"]
