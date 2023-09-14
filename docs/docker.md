# Docker

## Troubleshooting

### Delete Database Volume and Start Over

If you get `PostgreSQL Database directory appears to contain a database; Skipping initialization`, run:

```bash
docker-compose down --volumes
```
