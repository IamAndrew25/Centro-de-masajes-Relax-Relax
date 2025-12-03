#!/bin/bash

DATE=$(date +%F_%H-%M)
BACKUP_DIR=/backups

mkdir -p $BACKUP_DIR

mysqldump -h centromasajes-db -uroot -p"" centro_masajes > $BACKUP_DIR/backup_$DATE.sql
