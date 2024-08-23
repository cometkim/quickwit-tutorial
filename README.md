# Quickwi Tutorial w/ Docker Compose

[Quickwit](https://quickwit.io/) local setup for demonstration purpose, fully powered by containers & Docker Compose.

## Prerequisite

- OrbStack or Docker (uncomment port mapping in [docker-compose.yml](docker-compose.yml))
- 2~5GB of free space

## How to

> [!NOTE]
> `docker-compose.yml` assumes that you are using [OrbStack proxy](https://docs.orbstack.dev/docker/domains#ports).
> If you are using Docker, uncomment the `"ports"` mappings in the file.

### Starting services

To start services

```bash
docker compose up -d
```

compose includes these pre-configured services

- `quickwit`
  - Quickwit single node config
  - Endpoints:
    - [Quickwit UI](https://quickwit.quickwit-tutorial.orb.local)
    - HTTP services: 7280
    - OTLP gRPC: 7281

- `jaeger`
  - Jaeger client, using Quickwit as its backend
  - Endpoints:
    - [Jaeger UI](https://jaeger.quickwit-tutorial.orb.local)

- `grafana`
  - Endpoints:
    - [Dashboards -> Indexer metrics](https://grafana.quickwit-tutorial.orb.local/d/quickwit-indexers/quickwit-indexers)
    - [Dashboards -> Metastore metrics](https://grafana.quickwit-tutorial.orb.local/d/quickwit-metastore/quickwit-metastore)
    - [Dashboards -> Search metrics](https://grafana.quickwit-tutorial.orb.local/d/quickwit-searchers/quickwit-searchers)
    - Explore -> Quickwit OTEL Logs
    - Explore -> Quickwit OTEL Traces
    - Explore -> Jaeger

- `prometheus`
  - Scrape Quickwit metrics

### Ingesting sample data

While running services, you can create index with pre-configured config and data.

- HDFS logs (10K): `docker compose up ingest-hdfs-10k`
- HDFS logs (20M): `docker compose up ingest-hdfs-20m`
- Stackoverflow posts (10K): `docker compose up ingest-stackoverflow`
