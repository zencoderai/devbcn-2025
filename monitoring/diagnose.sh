#!/bin/bash

echo "=== Monitoring Diagnostics ==="
echo

echo "1. Checking if services are running..."
docker compose ps

echo
echo "2. Testing FastAPI metrics endpoint..."
echo "Checking http://localhost:8000/metrics"
curl -s http://localhost:8000/metrics | head -20

echo
echo "3. Testing Prometheus targets..."
echo "Checking Prometheus targets status:"
curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | {job: .labels.job, health: .health, lastError: .lastError}'

echo
echo "4. Testing if Prometheus can query FastAPI metrics..."
echo "Querying for http_requests_total:"
curl -s "http://localhost:9090/api/v1/query?query=http_requests_total" | jq '.data.result[] | {metric: .metric, value: .value}'

echo
echo "5. Testing Grafana health..."
curl -s http://localhost:3001/api/health | jq '.'

echo
echo "6. Checking Grafana datasources..."
curl -s -u admin:admin http://localhost:3001/api/datasources | jq '.[] | {name: .name, type: .type, url: .url, access: .access}'

echo
echo "=== Diagnostic complete ==="
echo "If you see errors above, check the docker compose logs for the specific service"
echo "Example: docker compose logs prometheus"