// Run: SKIP_DB_CREATION=true yarn test ./src/modules/pitches/pitch.test.ts --watch --detectOpenHandles
import 'reflect-metadata';
import { Binding } from '../../../generated/binding';
import { createFounderSetup } from '../../../test/common';
import { TestServerService } from '../../../test/server';
import { callAPIError, callAPISuccess, getContainer } from '../../core';
import { Pitch, PitchStatus } from './pitch/pitch.model';

let founderBinding: Binding;
let systemBinding: Binding;
let pitch: Pitch;
let testServer: TestServerService;

beforeAll(async () => {
  testServer = await getContainer(TestServerService).start();

  ({ founderBinding } = await callAPISuccess(createFounderSetup(testServer)));
  systemBinding = await testServer.getSystemAdminAuthBinding();
});

beforeEach(async () => {
  pitch = await callAPISuccess(founderBinding.mutation.createPitch({ data: {} }, `{ id status }`));
  // console.log('pitch :>> ', pitch);
});

afterAll(async () => {
  await testServer.stop();
});

describe('Pitch', () => {
  describe('As an admin', () => {
    test('Cannot unpublish a DRAFT pitch', async () => {
      expect(pitch.status).toBe(PitchStatus.DRAFT);

      const error = await callAPIError(
        systemBinding.mutation.unpublishPitch({
          where: { id: pitch.id },
        })
      );

      expect(error.message).toContain(
        'You can only unpublish PUBLISHED pitches. This pitch has status = DRAFT'
      );
    });

    test('Can publish a DRAFT pitch', async () => {
      expect(pitch.status).toBe(PitchStatus.DRAFT);

      const result = await callAPISuccess(
        systemBinding.mutation.publishPitch({
          where: { id: pitch.id },
        })
      );

      expect(result.status).toBe(PitchStatus.PUBLISHED);
    });

    test('Cannot re-publish a PUBLISHED pitch', async () => {
      expect(pitch.status).toBe(PitchStatus.DRAFT);

      const result = await callAPISuccess(
        systemBinding.mutation.publishPitch({
          where: { id: pitch.id },
        })
      );
      expect(result.status).toBe(PitchStatus.PUBLISHED);

      const error = await callAPIError(
        systemBinding.mutation.publishPitch({
          where: { id: pitch.id },
        })
      );

      expect(error.message).toContain(
        'You can not publish this pitch because it is already PUBLISHED'
      );
    });

    test('Can publish then unpublish', async () => {
      expect(pitch.status).toBe(PitchStatus.DRAFT);

      const result = await callAPISuccess(
        systemBinding.mutation.publishPitch({
          where: { id: pitch.id },
        })
      );
      expect(result.status).toBe(PitchStatus.PUBLISHED);

      const result2 = await callAPISuccess(
        systemBinding.mutation.unpublishPitch({
          where: { id: pitch.id },
        })
      );
      expect(result2.status).toBe(PitchStatus.ACTIVE);
    });
  });
});
