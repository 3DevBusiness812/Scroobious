// Run: SKIP_DB_CREATION=true yarn test ./src/modules/pitches/pitch-user-status/pitch-user-status.test.ts --watch --detectOpenHandles
import 'reflect-metadata';
import { Binding } from '../../../../generated/binding';
import { createFounderSetup, createInvestorSetup } from '../../../../test/common';
import { TestServerService } from '../../../../test/server';
import { callAPISuccess, getContainer } from '../../../core';
import { Pitch } from '../pitch/pitch.model';
import { PitchListStatus } from './pitch-user-status.model';

let founderBinding: Binding;
let investorBinding: Binding;
let pitch: Pitch;
let testServer: TestServerService;

// TODO: fix this test
beforeAll(async () => {
  testServer = await getContainer(TestServerService).start();

  ({ founderBinding } = await callAPISuccess(createFounderSetup(testServer)));
  ({ investorBinding } = await callAPISuccess(createInvestorSetup(testServer)));
});

afterAll(async () => {
  await testServer.stop();
});

beforeEach(async () => {
  pitch = await callAPISuccess(founderBinding.mutation.createPitch({ data: {} }, `{ id status }`));
  // console.log('pitch :>> ', pitch);
});

describe.only('PitchUserStatus', () => {
  test('Create pitch and update user status to bookmarked', async () => {
    const pitch = await founderBinding.mutation.createPitch({ data: {} });
    const pitchUserStatus = await investorBinding.query.pitchUserStatus({
      where: { pitchId: pitch.id },
    });
    // console.log('pitchUserStatus :>> ', pitchUserStatus);

    expect(pitchUserStatus).toBeFalsy();

    let response = await investorBinding.mutation.upsertPitchUserStatus(
      {
        data: { pitchId: pitch.id, listStatus: PitchListStatus.BOOKMARK },
        where: { pitchId_eq: pitch.id },
      },
      '{ data { id userId pitchId listStatus } action }'
    );

    expect(response.action).toBe('CREATE');
    expect(response.data.listStatus).toBe(PitchListStatus.BOOKMARK);

    response = await investorBinding.mutation.upsertPitchUserStatus(
      {
        data: { pitchId: pitch.id, listStatus: PitchListStatus.IGNORE },
        where: { pitchId_eq: pitch.id },
      },
      '{ data { id userId pitchId listStatus } action }'
    );

    expect(response.action).toBe('UPDATE');
    expect(response.data.listStatus).toBe(PitchListStatus.IGNORE);
  });
});
