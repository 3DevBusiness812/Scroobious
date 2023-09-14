import { BatchJob, JobProcessorOptions } from '../../../core/types';

const queue: BatchJob<null> = {
  name: 'pitch.compute-female-minority',
  process,
  schedule: {
    repeat: {
      every: 10 * 60 * 1000, // 10 minutes
    },
  },
  scheduler: true,
};

async function process({ dbConnection }: JobProcessorOptions<null>): Promise<void> {
  const tempTable = `
    with t as (
        SELECT 
          fp.id,
          fp.user_id,
          fp.gender,
          CASE WHEN fp.gender = 'WOMAN' THEN true ELSE false END AS female,
          fp.ethnicities,
          CASE 
            WHEN fp.ethnicities IS NULL then false
            WHEN fp.ethnicities @> ARRAY[CAST('WHITE' AS VARCHAR)] THEN false 
            WHEN fp.ethnicities @> ARRAY[CAST('NOC' AS VARCHAR)] THEN false 
            WHEN array_length(fp.ethnicities, 1) IS NULL THEN false
            ELSE true END AS minority
        FROM founder_profile fp
    )`;

  const minorityQuery = `
        ${tempTable}
    
        UPDATE pitch as p
        SET minority = t.minority
        FROM t
        WHERE 
        p.user_id = t.user_id
        AND (
            (p.minority IS NULL AND t.minority IS NOT NULL) OR
            p.minority <> t.minority
        );
    `;

  const femaleQuery = `
        ${tempTable}

        UPDATE pitch as p
        SET female = t.female
        FROM t
        WHERE 
        p.user_id = t.user_id
        AND (
            (p.female IS NULL AND t.female IS NOT NULL) OR
            p.female <> t.female
        );
    `;

  await dbConnection.manager.query(minorityQuery);
  await dbConnection.manager.query(femaleQuery);
  return;
}

export default queue;
