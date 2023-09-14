import 'reflect-metadata';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { createPermission, createRole, createRolePermission } from '../helpers/permissions';

export class addFounderRolesAndPermissions1647409986809 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // console.log('rolesAndPermissions1631764501185 up: getting DB connection');

    await createRole('founder-lite', 'Founder Lite');
    await createRole('founder-medium', 'Founder Medium');
    await createRole('founder-full', 'Founder Full');

    await createPermission('pitch:read', 'See your own pitches');
    await createPermission(
      'course:fomo',
      'Give access to see some info about PiP to generate fomo'
    );
    await createPermission(
      'pitch:fomo',
      'Give access to see some info about Pitches to generate fomo'
    );
    await createPermission(
      'conversation_message:fomo',
      'Give access to see some info about Pitches to generate fomo'
    );

    // Lite
    // Yes: Dashboard (will have upgrade message in boxes for Insights & Messages), Perks, Resources
    // No: PiP, request feedback, messaging
    await createRolePermission('founder-lite', 'pitch:read');
    await createRolePermission('founder-lite', 'course:fomo');
    await createRolePermission('founder-lite', 'pitch:fomo');
    await createRolePermission('founder-lite', 'conversation_message:fomo');
    await createRolePermission('founder-lite', 'perk:list');
    await createRolePermission('founder-lite', 'suggested_resource:list');

    // Medium
    // Yes: Dashboard, Perks, Resources, PiP, request investor portal listing, messaging
    // No: Request feedback
    await createRolePermission('founder-medium', 'pitch:read');
    await createRolePermission('founder-medium', 'course:list');
    await createRolePermission('founder-medium', 'conversation_message:list');
    await createRolePermission('founder-medium', 'perk:list');
    await createRolePermission('founder-medium', 'suggested_resource:list');
    await createRolePermission('founder-medium', 'pitch:create');

    // Full
    // Yes: Dashboard, Perks, Resources, PiP, request feedback, request investor portal listing, messaging
    // No: nothing
    await createRolePermission('founder-full', 'pitch:read');
    await createRolePermission('founder-full', 'course:list');
    await createRolePermission('founder-full', 'conversation_message:list');
    await createRolePermission('founder-full', 'perk:list');
    await createRolePermission('founder-full', 'suggested_resource:list');
    await createRolePermission('founder-full', 'pitch:create');
    await createRolePermission('founder-full', 'pitch_written_feedback:request');
    await createRolePermission('founder-full', 'pitch_meeting_feedback:request');
    await createRolePermission('founder-full', 'pitch_written_feedback:list');
    await createRolePermission('founder-full', 'pitch_meeting_feedback:list');

    // TODO: remove legacy "founder" role
    // TODO: should only generate course services if user has these permissions:

    // await createRolePermission('founder-medium', 'pitch_written_feedback:request');
    // await createRolePermission('founder-medium', 'pitch_meeting_feedback:request');
    // await createRolePermission('founder-medium', 'pitch_written_feedback:list');
    // await createRolePermission('founder-medium', 'pitch_meeting_feedback:list');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
