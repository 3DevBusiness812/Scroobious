# Pitches

Navigating to to associations:

- pitch -> user -> founder_profile
- pitch -> organization -> startup

```sql
SELECT u.name, u.email, u.status,
  o.name AS organization_name, o.website,
  p.short_description,
  fp.twitter_url, fp.linkedin_url, fp.origin_story,
  s.website, s.name, s.corporate_structure, s.country, s.fundraise_status
FROM pitch p
INNER JOIN public.user u ON p.user_id = u.id
INNER JOIN founder_profile fp ON fp.user_id = u.id
INNER JOIN organization o ON p.organization_id = o.id
INNER JOIN startup s ON s.organization_id = o.id;
```
