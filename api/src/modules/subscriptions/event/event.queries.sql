-- Re-sync user data to customer.io by firing a "user.update" event
INSERT INTO
    event (
        payload,
        created_at,
        status,
        object_type,
        object_id,
        owner_id,
        created_by_id,
        id,
        status_message,
        type
    )
SELECT
    e.payload,
    e.created_at,
    'NEW',
    e.object_type,
    e.object_id,
    e.owner_id,
    e.created_by_id,
    substr(md5(random() :: text), 0, 25) AS id,
    e.status_message,
    'user.update'
FROM
    event e
    INNER JOIN public.user u ON e.owner_id = u.id
WHERE
    e.type = 'user.create'
    AND u.email = 'blomas74@gmail.com';