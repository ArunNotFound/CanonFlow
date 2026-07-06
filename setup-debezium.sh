#!/bin/bash
# Sets up the Debezium Postgres connector via Kafka Connect REST API

curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ -d '{
  "name": "canonflow-postgres-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "tasks.max": "1",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "user",
    "database.password": "pass",
    "database.dbname": "mydb",
    "database.server.name": "dbserver1",
    "schema.include.list": "public",
    "table.include.list": "public.users,public.products",
    "plugin.name": "pgoutput",
    "slot.name": "canonflow_cdc_slot",
    "publication.name": "canonflow_publication"
  }
}'
