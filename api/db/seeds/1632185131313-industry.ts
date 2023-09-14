import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'industry';
const listItems = [
  { id: 'AI', description: 'Artificial Intelligence' },
  { id: 'BIOTECH', description: 'Biotechnology' },
  { id: 'BUS_SERVE', description: 'Business Services' },
  { id: 'COMMUNITY', description: 'Community & Lifestyle' },
  { id: 'CONSUMER', description: 'Consumer Goods' },
  { id: 'DATA', description: 'Data & Analytics' },
  { id: 'ECOMM', description: 'E-Commerce' },
  { id: 'EDU', description: 'Education' },
  { id: 'FIN_SERVE', description: 'Financial Services' },
  { id: 'FIN_TECH', description: 'FinTech' },
  { id: 'FOOD', description: 'Food & Drink' },
  { id: 'GAMES', description: 'Games/Media/Entertainment' },
  { id: 'HARD', description: 'Hardware' },
  { id: 'HEALTH', description: 'Healthcare' },
  { id: 'IT', description: 'Information Technology' },
  { id: 'INT_SERVE', description: 'Internet Services' },
  { id: 'ML', description: 'Machine Learning' },
  { id: 'MANUFAC', description: 'Manufacturing' },
  { id: 'MED_DEV', description: 'Medical Device' },
  { id: 'MOBILE', description: 'Mobile' },
  { id: 'PETS', description: 'Pets' },
  { id: 'SECURITY', description: 'Privacy & Security' },
  { id: 'PROF_SERVE', description: 'Professional Services' },
  { id: 'REAL_ESTATE', description: 'Real Estate' },
  { id: 'RETAIL', description: 'Retail' },
  { id: 'SAAS', description: 'SaaS' },
  { id: 'SALES', description: 'Sales & Marketing' },
  { id: 'SCIENCE', description: 'Science & Engineering' },
  { id: 'SOCIAL', description: 'Social Impact' },
  { id: 'SOFTWARE', description: 'Software' },
  { id: 'SPORTS', description: 'Sports' },
  { id: 'SUSTAIN', description: 'Sustainability' },
  { id: 'TECH', description: 'Technology' },
  { id: 'TRANSPORT', description: 'Transportation' },
  { id: 'TRAVEL', description: 'Travel & Tourism' },
  { id: 'WELLNESS', description: 'Wellness/Beauty/Cosmetics' },
  { id: 'OTHER', description: 'Other' },
];

export class industry1632185131313 implements MigrationInterface {
  name = 'industry1632185131313';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
