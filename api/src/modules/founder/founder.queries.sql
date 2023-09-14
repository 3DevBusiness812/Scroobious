SELECT
    u.id AS user_id,
    o.name AS organization_name,
    u.created_at AS user_created_at,
    u.updated_at AS user_updated_at,
    u.name AS user_name,
    u.capabilities AS user_capabilities,
    u.email AS user_email,
    u.status AS user_status,
    u.is_accredited AS user_is_accredited,
    u.stripe_user_id AS user_stripe_user_id,
    COALESCE(u.last_login_at, '2000-01-01') AS user_last_login_at,
    fp.state_province AS fp_state_province,
    fp.twitter_url AS fp_twitter_url,
    fp.linkedin_url AS fp_linkedin_url,
    fp.ethnicities AS fp_ethnicities,
    fp.gender AS fp_gender,
    fp.sexual_orientation AS fp_sexual_orientation,
    fp.transgender AS fp_transgender,
    fp.disability AS fp_disability,
    fp.company_roles AS fp_company_roles,
    fp.working_status AS fp_working_status,
    fp.source AS fp_source,
    fp.pronouns AS fp_pronouns,
    fp.bubble_location AS fp_bubble_location,
    fp.created_at AS fp_created_at,
    s.version AS startup_version,
    s.additional_team_members AS startup_additional_team_members,
    s.updated_at AS startup_updated_at,
    s.deck_comfort_level AS startup_deck_comfort_level,
    s.presentation_comfort_level AS startup_presentation_comfort_level,
    s.name AS startup_name,
    s.website AS startup_website,
    s.corporate_structure AS startup_corporate_structure,
    s.state_province AS startup_state_province,
    s.fundraise_status AS startup_fundraise_status,
    s.company_stage AS startup_company_stage,
    s.revenue AS startup_revenue,
    s.short_description AS startup_short_description,
    s.organization_id AS startup_organization_id,
    s.industries AS startup_industries,
    s.origin_story AS startup_origin_story,
    s.business_challenge AS startup_business_challenge,
    s.presentation_status AS startup_presentation_status,
    s.desired_support AS startup_desired_support,
    s.anything_else AS startup_anything_else,
    s.country AS startup_country
FROM
    public.user u
    LEFT JOIN founder_profile fp ON u.id = fp.user_id
    LEFT JOIN startup s ON u.id = s.user_id
    LEFT JOIN organization o ON u.id = o.user_id
WHERE
    u.capabilities IS NOT NULL
    AND u.status = 'ACTIVE'
    AND u.migrated_from_bubble = false
    AND fp.id IS NOT NULL
    AND s.id IS NULL
ORDER BY
    u.created_at DESC;

INSERT INTO
    organization (
        id,
        user_id,
        owner_id,
        created_at,
        created_by_id,
        updated_by_id,
        updated_at,
        deleted_at,
        deleted_by_id,
        version,
        name,
        website
    )
SELECT
    substr(md5(random() :: text), 0, 25) AS id,
    u.id user_id,
    u.id owner_id,
    now() created_at,
    u.id AS created_by_id,
    NULL updated_by_id,
    NULL updated_at,
    NULL deleted_at,
    NULL deleted_by_id,
    1 AS version,
    CONCAT(u.name, ' Company') AS name,
    'https://www.website.com' AS website
FROM
    public.user u
WHERE
    u.email = 'susan@buildstack.ai';

INSERT INTO
    startup(
        id,
        user_id,
        created_at,
        created_by_id,
        updated_by_id,
        deleted_at,
        deleted_by_id,
        owner_id,
        version,
        additional_team_members,
        updated_at,
        deck_comfort_level,
        presentation_comfort_level,
        name,
        website,
        corporate_structure,
        state_province,
        fundraise_status,
        company_stage,
        revenue,
        short_description,
        organization_id,
        industries,
        origin_story,
        business_challenge,
        presentation_status,
        desired_support,
        anything_else,
        country
    )
SELECT
    substr(md5(random() :: text), 0, 25) AS id,
    u.id AS user_id,
    now() AS created_at,
    u.id AS created_by_id,
    NULL AS updated_by_id,
    NULL AS deleted_at,
    NULL AS deleted_by_id,
    u.id AS owner_id,
    1 AS version,
    false AS additional_team_members,
    NULL AS updated_at,
    10 AS deck_comfort_level,
    10 AS presentation_comfort_level,
    CONCAT(u.name, ' Company') AS name,
    'https://www.website.com' AS website,
    'OTHER' AS corporate_structure,
    'MA' AS state_province,
    'OTHER' AS fundraise_status,
    'OTHER' AS company_stage,
    'PRE' AS revenue,
    'n/a' AS short_description,
    o.id AS organization_id,
    '{OTHER}' AS industries,
    'n/a' AS origin_story,
    'n/a' AS business_challenge,
    'BOTH-PRES' AS presentation_status,
    'n/a' AS desired_support,
    'n/a' AS anything_else,
    'USA' AS country
FROM
    public.user u
    INNER JOIN organization o ON u.id = o.user_id
WHERE
    u.email = 'susan@buildstack.ai';