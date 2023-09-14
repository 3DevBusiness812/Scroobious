-- Show pitches and files attached
SELECT
    u.id,
    u.name,
    u.email,
    p.short_description,
    v.wistia_id,
    v.*
FROM
    public.user u
    LEFT JOIN pitch p ON p.user_id = u.id
    LEFT JOIN video v ON v.owner_id = u.id
    LEFT JOIN file f ON f.owner_id = u.id
WHERE
    u.email LIKE '%blomas74@gmail.com%';