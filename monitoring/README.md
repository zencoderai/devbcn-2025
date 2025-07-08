# Conference API Monitoring

This directory contains the monitoring setup for the Conference API using Prometheus and Grafana.

## Components

- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **PostgreSQL Exporter**: Database metrics collection

## Services and Ports

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)
- **PostgreSQL Exporter**: http://localhost:9187
- **Conference API Metrics**: http://localhost:8000/metrics

## Getting Started

1. Start all services:
   ```bash
   docker compose up -d
   ```

2. Access Grafana at http://localhost:3001
   - Username: `admin`
   - Password: `admin`

3. The Conference API Dashboard should be automatically provisioned and available.

## Available Metrics

### API Metrics (from FastAPI Instrumentator)
- `http_requests_total`: Total number of HTTP requests
- `http_request_duration_seconds`: HTTP request duration histogram
- `http_requests_created`: Timestamp of when HTTP requests counter was created

### Database Metrics (from PostgreSQL Exporter)
- `pg_stat_database_numbackends`: Number of active connections
- `pg_stat_database_xact_commit`: Number of committed transactions
- `pg_stat_database_xact_rollback`: Number of rolled back transactions
- `pg_up`: PostgreSQL server availability

## Dashboard Features

The Conference API Dashboard includes:

1. **Request Rate**: Shows the rate of incoming requests per second
2. **Response Time**: 95th and 50th percentile response times
3. **HTTP Status Codes**: Distribution of HTTP response codes
4. **Service Status**: API availability status
5. **Database Connections**: Number of active database connections
6. **Database Transactions**: Commit and rollback rates

## Customization

- **Prometheus Configuration**: Edit `prometheus.yml` to add more scrape targets
- **Grafana Dashboards**: Modify or add new dashboards in `grafana/provisioning/dashboards/`
- **Data Sources**: Configure additional data sources in `grafana/provisioning/datasources/`

## Troubleshooting

1. **Metrics not appearing**: Check if the backend service is running and accessible at http://localhost:8000/metrics
2. **Database metrics missing**: Verify PostgreSQL exporter can connect to the database
3. **Grafana dashboard not loading**: Check if Prometheus is accessible from Grafana container

## Alerting (Future Enhancement)

Consider adding alerting rules for:
- High error rates (4xx/5xx responses)
- High response times
- Database connection issues
- Service downtime