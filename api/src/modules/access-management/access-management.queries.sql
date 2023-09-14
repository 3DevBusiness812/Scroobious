SELECT
    p.code,
    r.code,
    u.capabilities,
    *
FROM
    public.user u
    INNER JOIN user_role ur ON ur.user_id = u.id
    INNER JOIN role r ON ur.role_id = r.id
    INNER JOIN role_permission rp ON rp.role_id = r.id
    INNER JOIN permission p ON rp.permission_id = p.id