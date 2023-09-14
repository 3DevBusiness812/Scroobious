import { BatchJob, JobProcessorOptions } from '../../../core/types';

const queue: BatchJob<null> = {
  name: 'pitch.compute-aggregates',
  process,
  schedule: {
    repeat: {
      every: 1 * 60 * 1000, // 1 minutes
    },
  },
  scheduler: true,
};

async function process({ dbConnection }: JobProcessorOptions<null>): Promise<void> {
  return await dbConnection.manager.query(`
        with t as (
            SELECT
              pitch.id AS id,
              CASE WHEN pb.bookmarks IS NULL THEN 0 ELSE pb.bookmarks END AS computed_bookmarks,
              CASE WHEN pv.views IS NULL THEN 0 ELSE pv.views END AS computed_views,
              pitch.bookmarks AS table_bookmarks,
              pitch.views AS table_views
            FROM pitch
            LEFT JOIN
            (
              SELECT pitch_id, COUNT(*) as bookmarks
              FROM pitch_user_status
              WHERE list_status = 'BOOKMARK'
              GROUP BY pitch_id
            ) pb ON pitch.id = pb.pitch_id
            LEFT JOIN
            (
              SELECT pitch_id, COUNT(*) as views
              FROM pitch_user_status
              GROUP BY pitch_id
            ) pv ON pitch.id = pb.pitch_id
        )
        UPDATE pitch AS p
        SET bookmarks = t.computed_bookmarks,
            views = t.computed_views FROM t
        WHERE t.id = p.id
          AND (
            t.computed_bookmarks <> table_bookmarks
            OR t.computed_views <> table_views
          )
    `);
}

export default queue;
