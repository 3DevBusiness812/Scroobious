INSERT INTO
    event(
        id,
        type,
        status,
        object_type,
        object_id,
        owner_id,
        payload,
        created_at,
        created_by_id
    )
SELECT
    substr(md5(random() :: text), 0, 25) AS id,
    'startup.update' AS type,
    'NEW' AS status,
    'startup' AS object_type,
    s.id AS object_id,
    '1' AS owner_id,
    (
        '{ "data": { }, "resource": { "id": "' || s.id || '" } }'
    ) :: jsonb AS payload,
    NOW() AS created_at,
    '1' AS created_by_id
FROM
    startup s;

-- Watch them get processed
-- SELECT * FROM event WHERE type LIKE '%startup%' ORDER BY created_at DESC;