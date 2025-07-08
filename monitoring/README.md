# Monitoring Setup

This directory contains the monitoring configuration for the Conference API using Prometheus and Grafana.

## Components

- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **PostgreSQL Exporter**: Database metrics collection

## Services and Ports

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)
- **PostgreSQL Exporter**: http://localhost:9187

## Getting Started

1. Start all services:
   ```bash
   docker compose up -d
   ```

2. Access Grafana at http://localhost:3001
   - Username: `admin`
   - Password: `admin`

3. The following dashboards are automatically provisioned:
   - **Conference API Dashboard**: FastAPI metrics including request rate, response time, error rate, and resource usage
   - **PostgreSQL Dashboard**: Database metrics including connections, operations, and database size

## Available Metrics

### FastAPI Metrics (from `/metrics` endpoint)
- `http_requests_total`: Total HTTP requests
- `http_request_duration_seconds`: Request duration histogram
- `process_resident_memory_bytes`: Memory usage
- `process_cpu_seconds_total`: CPU usage

### PostgreSQL Metrics
- `pg_up`: Database availability
- `pg_stat_database_*`: Database statistics
- `pg_database_size_bytes`: Database size
- Connection counts and query statistics

## Customization

### Adding New Dashboards
1. Create a new JSON dashboard file in `monitoring/grafana/dashboards/`
2. Restart Grafana or wait for auto-reload (10 seconds)

### Modifying Prometheus Configuration
1. Edit `monitoring/prometheus/prometheus.yml`
2. Restart Prometheus: `docker compose restart prometheus`

### Adding New Metrics to FastAPI
The FastAPI app uses `prometheus-fastapi-instrumentator` which automatically provides:
- Request/response metrics
- Process metrics
- Custom metrics can be added using the `prometheus_client` library

## Troubleshooting

### Metrics Not Appearing
1. Check if the backend service is running and accessible
2. Verify Prometheus can scrape the `/metrics` endpoint: http://localhost:9090/targets
3. Check Prometheus logs: `docker compose logs prometheus`

### Dashboard Not Loading
1. Check Grafana logs: `docker compose logs grafana`
2. Verify datasource configuration in Grafana UI
3. Ensure Prometheus is accessible from Grafana container

### PostgreSQL Metrics Missing
1. Check postgres-exporter logs: `docker compose logs postgres-exporter`
2. Verify database connection string
3. Ensure PostgreSQL is accessible from the exporter container

## Alerting (Future Enhancement)

To add alerting:
1. Configure Alertmanager in docker-compose.yml
2. Add alerting rules to Prometheus configuration
3. Set up notification channels in Grafana