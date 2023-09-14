-- Show courses and all course products
SELECT
    u.id,
    u.email,
    c.id AS course_id,
    c.status AS course_status,
    p.status AS pitch_status,
    p.short_description,
    cp.status,
    cp.*
FROM
    public.user u
    LEFT JOIN course c ON c.owner_id = u.id
    LEFT JOIN pitch p ON c.pitch_id = p.id
    LEFT JOIN course_product cp ON cp.course_id = c.id
    AND cp.owner_id = u.id;