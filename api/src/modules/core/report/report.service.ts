import { Service } from 'typedi';
import { EntityManager, getManager } from 'typeorm';
import { StringMap } from 'warthog';

@Service('ReportService')
export class ReportService {
  manager: EntityManager;

  REPORTS: StringMap = {
    'messages-sent': `
      SELECT COUNT(*) as count
      FROM conversation_message
      WHERE created_by_id = $1;
    `,
  };

  constructor() {
    this.manager = getManager();
  }

  async runReport(type: string, userId: string) {
    const sql = this.REPORTS[type];
    if (!sql) {
      throw new Error(`Could not find report with type ${type}`);
    }

    const result = await this.manager.query(sql, [userId]);

    if (!result || !result.length) {
      throw new Error(`Unable to run query ${type}`);
    }

    return {
      result: result[0].count,
    };
  }
}
