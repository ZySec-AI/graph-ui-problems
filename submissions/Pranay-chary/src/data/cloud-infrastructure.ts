import type { GraphData } from '../types/graph';

export const cloudInfraData: GraphData = {
  meta: {
    title: 'Cloud Infrastructure Visualization',
    description: 'Interactive visualization of cloud microservices architecture with security groups and dependencies',
  },
  nodes: [
    // API Gateway Layer
    {
      id: 'api-gateway',
      label: 'API Gateway',
      type: 'gateway',
      properties: {
        status: 'healthy',
        version: 'v2.1.0',
        endpoints: 12,
        avgLatency: '45ms'
      },
      style: { color: '#FF6B6B' },
      group: 'gateway'
    },
    // Authentication Services
    {
      id: 'auth-service',
      label: 'Auth Service',
      type: 'service',
      properties: {
        status: 'healthy',
        version: 'v1.8.0',
        uptime: '99.99%',
        instances: 3
      },
      style: { color: '#4ECDC4' },
      group: 'security'
    },
    {
      id: 'jwt-service',
      label: 'JWT Service',
      type: 'service',
      properties: {
        status: 'healthy',
        version: 'v2.0.1',
        algorithm: 'RS256',
        keyRotation: '24h'
      },
      style: { color: '#4ECDC4' },
      group: 'security'
    },
    // Core Services
    {
      id: 'user-service',
      label: 'User Service',
      type: 'service',
      properties: {
        status: 'healthy',
        version: 'v2.3.0',
        activeUsers: '15.2K',
        cacheHitRate: '92%'
      },
      style: { color: '#45B7D1' },
      group: 'core'
    },
    {
      id: 'payment-service',
      label: 'Payment Service',
      type: 'service',
      properties: {
        status: 'warning',
        version: 'v2.0.0',
        tps: '850/s',
        successRate: '99.95%'
      },
      style: { color: '#45B7D1' },
      group: 'core'
    },
    {
      id: 'notification-service',
      label: 'Notification Service',
      type: 'service',
      properties: {
        status: 'healthy',
        version: 'v1.9.0',
        channels: ['email', 'push', 'sms'],
        deliveryRate: '99.8%'
      },
      style: { color: '#45B7D1' },
      group: 'core'
    },
    // Databases
    {
      id: 'user-db',
      label: 'User Database',
      type: 'database',
      properties: {
        type: 'PostgreSQL',
        version: '14.5',
        size: '250GB',
        replicas: 3
      },
      style: { color: '#96CEB4' },
      group: 'storage'
    },
    {
      id: 'payment-db',
      label: 'Payment Database',
      type: 'database',
      properties: {
        type: 'MongoDB',
        version: '6.0',
        size: '500GB',
        shards: 4
      },
      style: { color: '#96CEB4' },
      group: 'storage'
    },
    // Cache Layer
    {
      id: 'redis-cache',
      label: 'Redis Cache',
      type: 'cache',
      properties: {
        version: '7.0',
        hitRate: '95%',
        memory: '32GB',
        keys: '2.5M'
      },
      style: { color: '#FFEEAD' },
      group: 'cache'
    },
    // Message Queues
    {
      id: 'kafka-events',
      label: 'Kafka Event Bus',
      type: 'queue',
      properties: {
        version: '3.3',
        topics: 24,
        partitions: 96,
        throughput: '10K/s'
      },
      style: { color: '#D4A5A5' },
      group: 'messaging'
    },
    // Monitoring
    {
      id: 'prometheus',
      label: 'Prometheus',
      type: 'monitoring',
      properties: {
        status: 'healthy',
        metrics: '250K',
        retention: '30d',
        alerts: 156
      },
      style: { color: '#FCE77D' },
      group: 'monitoring'
    },
    {
      id: 'grafana',
      label: 'Grafana',
      type: 'monitoring',
      properties: {
        status: 'healthy',
        dashboards: 45,
        users: 120,
        version: '9.3.2'
      },
      style: { color: '#FCE77D' },
      group: 'monitoring'
    },
    // Security Groups
    {
      id: 'web-sg',
      label: 'Web Security Group',
      type: 'security-group',
      properties: {
        inbound: ['80', '443'],
        outbound: 'all',
        instances: 8
      },
      style: { color: '#FF9999' },
      group: 'security'
    },
    {
      id: 'app-sg',
      label: 'App Security Group',
      type: 'security-group',
      properties: {
        inbound: ['8080', '9000'],
        outbound: 'restricted',
        instances: 12
      },
      style: { color: '#FF9999' },
      group: 'security'
    },
    {
      id: 'db-sg',
      label: 'DB Security Group',
      type: 'security-group',
      properties: {
        inbound: ['5432', '27017'],
        outbound: 'none',
        instances: 6
      },
      style: { color: '#FF9999' },
      group: 'security'
    }
  ],
  edges: [
    // API Gateway Connections
    {
      source: 'api-gateway',
      target: 'auth-service',
      label: 'authenticates',
      direction: '->',
      style: { lineType: 'solid', color: '#666' }
    },
    {
      source: 'api-gateway',
      target: 'user-service',
      label: 'routes',
      direction: '->',
      style: { lineType: 'solid', color: '#666' }
    },
    {
      source: 'api-gateway',
      target: 'payment-service',
      label: 'routes',
      direction: '->',
      style: { lineType: 'solid', color: '#666' }
    },
    // Auth Service Connections
    {
      source: 'auth-service',
      target: 'jwt-service',
      label: 'validates',
      direction: '<->',
      style: { lineType: 'dashed', color: '#4ECDC4' }
    },
    {
      source: 'auth-service',
      target: 'user-db',
      label: 'reads',
      direction: '->',
      style: { lineType: 'dotted', color: '#96CEB4' }
    },
    // User Service Connections
    {
      source: 'user-service',
      target: 'user-db',
      label: 'writes',
      direction: '<->',
      style: { lineType: 'solid', color: '#96CEB4' }
    },
    {
      source: 'user-service',
      target: 'redis-cache',
      label: 'caches',
      direction: '<->',
      style: { lineType: 'dashed', color: '#FFEEAD' }
    },
    {
      source: 'user-service',
      target: 'kafka-events',
      label: 'publishes',
      direction: '->',
      style: { lineType: 'solid', color: '#D4A5A5' }
    },
    // Payment Service Connections
    {
      source: 'payment-service',
      target: 'payment-db',
      label: 'writes',
      direction: '<->',
      style: { lineType: 'solid', color: '#96CEB4' }
    },
    {
      source: 'payment-service',
      target: 'kafka-events',
      label: 'publishes',
      direction: '->',
      style: { lineType: 'solid', color: '#D4A5A5' }
    },
    // Notification Service Connections
    {
      source: 'notification-service',
      target: 'kafka-events',
      label: 'subscribes',
      direction: '<-',
      style: { lineType: 'dashed', color: '#D4A5A5' }
    },
    {
      source: 'notification-service',
      target: 'redis-cache',
      label: 'caches',
      direction: '<->',
      style: { lineType: 'dashed', color: '#FFEEAD' }
    },
    // Monitoring Connections
    {
      source: 'prometheus',
      target: 'grafana',
      label: 'visualizes',
      direction: '->',
      style: { lineType: 'solid', color: '#FCE77D' }
    },
    // Security Group Connections
    {
      source: 'web-sg',
      target: 'api-gateway',
      label: 'protects',
      direction: '->',
      style: { lineType: 'dotted', color: '#FF9999' }
    },
    {
      source: 'app-sg',
      target: 'user-service',
      label: 'protects',
      direction: '->',
      style: { lineType: 'dotted', color: '#FF9999' }
    },
    {
      source: 'app-sg',
      target: 'payment-service',
      label: 'protects',
      direction: '->',
      style: { lineType: 'dotted', color: '#FF9999' }
    },
    {
      source: 'app-sg',
      target: 'notification-service',
      label: 'protects',
      direction: '->',
      style: { lineType: 'dotted', color: '#FF9999' }
    },
    {
      source: 'db-sg',
      target: 'user-db',
      label: 'protects',
      direction: '->',
      style: { lineType: 'dotted', color: '#FF9999' }
    },
    {
      source: 'db-sg',
      target: 'payment-db',
      label: 'protects',
      direction: '->',
      style: { lineType: 'dotted', color: '#FF9999' }
    }
  ]
};
