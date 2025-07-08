#!/bin/bash

echo "Testing monitoring setup..."

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Test Prometheus
echo "Testing Prometheus..."
if curl -s http://localhost:9090/-/healthy > /dev/null; then
    echo "✅ Prometheus is healthy"
else
    echo "❌ Prometheus is not responding"
fi

# Test Grafana
echo "Testing Grafana..."
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Grafana is healthy"
else
    echo "❌ Grafana is not responding"
fi

# Test PostgreSQL Exporter
echo "Testing PostgreSQL Exporter..."
if curl -s http://localhost:9187/metrics > /dev/null; then
    echo "✅ PostgreSQL Exporter is healthy"
else
    echo "❌ PostgreSQL Exporter is not responding"
fi

# Test FastAPI metrics endpoint
echo "Testing FastAPI metrics..."
if curl -s http://localhost:8000/metrics > /dev/null; then
    echo "✅ FastAPI metrics endpoint is working"
else
    echo "❌ FastAPI metrics endpoint is not responding"
fi

# Generate some test traffic
echo "Generating test traffic..."
for i in {1..10}; do
    curl -s http://localhost:8000/ > /dev/null
    curl -s http://localhost:8000/health > /dev/null
    curl -s http://localhost:8000/conference-info > /dev/null
    curl -s http://localhost:8000/talks/ > /dev/null
done

echo "Test traffic generated. Check Grafana dashboards at http://localhost:3001"
echo "Default credentials: admin/admin"