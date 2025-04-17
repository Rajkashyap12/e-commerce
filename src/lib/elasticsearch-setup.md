# Elasticsearch Integration Guide

## Overview
This document outlines how to integrate Elasticsearch with our Supabase PostgreSQL database for enhanced product search functionality.

## Setup Options

### Option 1: Using Supabase Vector Extension (Recommended)
Supabase has built-in support for full-text search through PostgreSQL's text search capabilities, which we're already using in our implementation.

For more advanced search features:

1. Enable the `pg_vector` extension in Supabase
2. Create embeddings for product descriptions
3. Use vector similarity search for more accurate results

### Option 2: External Elasticsearch Service

1. Set up an Elasticsearch cluster (using services like Elastic Cloud, AWS Elasticsearch, or self-hosted)
2. Create a sync mechanism to keep Elasticsearch in sync with PostgreSQL data:
   - Use PostgreSQL triggers to send changes to a queue
   - Use a service like Logstash or a custom sync service to process the queue and update Elasticsearch

3. Create an API endpoint that queries Elasticsearch and returns results

## Implementation Details

### Data Synchronization
To keep Elasticsearch in sync with our PostgreSQL database:

```sql
-- Create a function to notify about product changes
CREATE OR REPLACE FUNCTION notify_product_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'product_changes',
    json_build_object(
      'operation', TG_OP,
      'record', row_to_json(NEW)
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for product changes
CREATE TRIGGER products_insert_trigger
AFTER INSERT ON products
FOR EACH ROW
EXECUTE FUNCTION notify_product_change();

CREATE TRIGGER products_update_trigger
AFTER UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION notify_product_change();

CREATE TRIGGER products_delete_trigger
AFTER DELETE ON products
FOR EACH ROW
EXECUTE FUNCTION notify_product_change();
```

### Search API
Create a serverless function or Edge Function in Supabase to query Elasticsearch:

```typescript
import { Client } from '@elastic/elasticsearch'

export async function searchProducts(query: string) {
  const client = new Client({
    node: process.env.ELASTICSEARCH_URL,
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD
    }
  })

  const result = await client.search({
    index: 'products',
    body: {
      query: {
        multi_match: {
          query: query,
          fields: ['name^3', 'description'],
          fuzziness: 'AUTO'
        }
      }
    }
  })

  return result.body.hits.hits.map(hit => ({
    id: hit._id,
    ...hit._source
  }))
}
```

## Fallback Strategy
Our current implementation uses PostgreSQL's built-in text search as a fallback when Elasticsearch is not available. This ensures the application remains functional even if there are issues with the Elasticsearch service.
