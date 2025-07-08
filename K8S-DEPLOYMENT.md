# Kubernetes Deployment Guide

This guide explains how to deploy the DevBCN Conference application to Kubernetes.

## Prerequisites

1. **Kubernetes Cluster**: You need access to a Kubernetes cluster (local or cloud)
2. **kubectl**: Kubernetes command-line tool installed and configured
3. **Ingress Controller**: NGINX Ingress Controller installed in your cluster
4. **Docker Images**: Build and push your application images to a registry

## Architecture Overview

The application consists of:
- **Frontend**: React application (2 replicas)
- **Backend**: FastAPI application (2 replicas)
- **Database**: PostgreSQL (1 replica with persistent storage)
- **Monitoring**: Prometheus, Grafana, and PostgreSQL Exporter

## Files Structure

```
k8s-namespace.yaml      # Namespace definition
k8s-configmap.yaml      # Configuration and secrets
k8s-postgres.yaml       # PostgreSQL database
k8s-backend.yaml        # Backend API service
k8s-frontend.yaml       # Frontend application
k8s-monitoring.yaml     # Monitoring stack
deploy.sh               # Deployment script
```

## Quick Deployment

### 1. Build and Push Docker Images

First, build and push your Docker images to a registry:

```bash
# Build backend image
docker build -t your-registry/devbcn-backend:latest ./backend
docker push your-registry/devbcn-backend:latest

# Build frontend image
docker build -t your-registry/devbcn-frontend:latest ./frontend
docker push your-registry/devbcn-frontend:latest
```

### 2. Update Image References

Update the image references in the deployment files:
- In `k8s-backend.yaml`: Change `devbcn-backend:latest` to your image
- In `k8s-frontend.yaml`: Change `devbcn-frontend:latest` to your image

### 3. Deploy to Kubernetes

Run the deployment script:

```bash
./deploy.sh
```

Or deploy manually:

```bash
kubectl apply -f k8s-namespace.yaml
kubectl apply -f k8s-configmap.yaml
kubectl apply -f k8s-postgres.yaml
kubectl apply -f k8s-backend.yaml
kubectl apply -f k8s-frontend.yaml
kubectl apply -f k8s-monitoring.yaml
```

### 4. Configure Local Access

Add the following to your `/etc/hosts` file:

```
127.0.0.1 devbcn-conference.local api.devbcn-conference.local prometheus.devbcn-conference.local grafana.devbcn-conference.local
```

## Access URLs

- **Frontend**: http://devbcn-conference.local
- **Backend API**: http://api.devbcn-conference.local
- **Prometheus**: http://prometheus.devbcn-conference.local
- **Grafana**: http://grafana.devbcn-conference.local (admin/admin)

## Configuration Details

### Environment Variables

The application uses ConfigMaps and Secrets for configuration:

**ConfigMap (k8s-configmap.yaml)**:
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `DATABASE_URL`: Full database connection string
- `REACT_APP_API_URL`: Frontend API endpoint

**Secrets (k8s-configmap.yaml)**:
- `POSTGRES_PASSWORD`: Database password (base64 encoded)
- `GF_SECURITY_ADMIN_PASSWORD`: Grafana admin password (base64 encoded)

### Persistent Storage

The deployment creates persistent volumes for:
- PostgreSQL data (`postgres-pvc` - 10Gi)
- Prometheus data (`prometheus-pvc` - 10Gi)
- Grafana data (`grafana-pvc` - 5Gi)

### Resource Limits

Each service has defined resource requests and limits:
- **Backend/Frontend**: 256Mi-512Mi RAM, 250m-500m CPU
- **PostgreSQL**: 256Mi-512Mi RAM, 250m-500m CPU
- **Prometheus**: 512Mi-1Gi RAM, 250m-500m CPU
- **Grafana**: 256Mi-512Mi RAM, 250m-500m CPU

## Health Checks

The deployment includes health checks:
- **Liveness Probes**: Check if containers are running
- **Readiness Probes**: Check if containers are ready to serve traffic

## Monitoring

The monitoring stack includes:
- **Prometheus**: Metrics collection and alerting
- **Grafana**: Metrics visualization and dashboards
- **PostgreSQL Exporter**: Database metrics

## Troubleshooting

### Check Pod Status
```bash
kubectl get pods -n devbcn-conference
```

### View Logs
```bash
# Backend logs
kubectl logs -f deployment/backend -n devbcn-conference

# Frontend logs
kubectl logs -f deployment/frontend -n devbcn-conference

# Database logs
kubectl logs -f deployment/postgres -n devbcn-conference
```

### Check Services
```bash
kubectl get services -n devbcn-conference
```

### Check Ingress
```bash
kubectl get ingress -n devbcn-conference
kubectl describe ingress -n devbcn-conference
```

### Port Forwarding (Alternative Access)
If ingress is not working, you can use port forwarding:

```bash
# Frontend
kubectl port-forward service/frontend-service 3000:3000 -n devbcn-conference

# Backend
kubectl port-forward service/backend-service 8000:8000 -n devbcn-conference

# Grafana
kubectl port-forward service/grafana-service 3001:3000 -n devbcn-conference
```

## Scaling

Scale deployments as needed:

```bash
# Scale backend
kubectl scale deployment backend --replicas=3 -n devbcn-conference

# Scale frontend
kubectl scale deployment frontend --replicas=3 -n devbcn-conference
```

## Cleanup

To remove the entire deployment:

```bash
kubectl delete namespace devbcn-conference
```

## Production Considerations

For production deployment, consider:

1. **Image Security**: Use specific image tags, not `latest`
2. **Secrets Management**: Use external secret management (e.g., Vault)
3. **TLS/SSL**: Configure HTTPS with proper certificates
4. **Resource Limits**: Adjust based on actual usage
5. **Backup Strategy**: Implement database backup procedures
6. **Monitoring**: Set up alerting rules and notifications
7. **Network Policies**: Implement network segmentation
8. **RBAC**: Configure proper role-based access control

## Cloud Provider Specific Notes

### AWS EKS
- Use EBS for persistent volumes
- Configure ALB Ingress Controller
- Use RDS for production database

### Google GKE
- Use GCE Persistent Disks
- Configure GKE Ingress
- Use Cloud SQL for production database

### Azure AKS
- Use Azure Disks
- Configure Application Gateway Ingress
- Use Azure Database for PostgreSQL

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Kubernetes events: `kubectl get events -n devbcn-conference`
3. Check application logs as shown above