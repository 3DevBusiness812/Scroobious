import 'reflect-metadata';
import { Binding } from '../../../../generated/binding';
import { createFounderSetup } from '../../../../test/common';
import { TestServerService } from '../../../../test/server';
import { callAPISuccess, getContainer } from '../../../core';
import { Pitch } from '../pitch/pitch.model';

let testServer: TestServerService;
let founderBinding: Binding;
let pitch: Pitch;

beforeAll(async () => {
  testServer = await getContainer(TestServerService).start();

  ({ founderBinding } = await callAPISuccess(createFounderSetup(testServer)));
});

beforeEach(async () => {
  pitch = await callAPISuccess(founderBinding.mutation.createPitch({ data: {} }, `{ id status }`));
  // console.log('pitch :>> ', pitch);
});

afterAll(async () => {
  await testServer.stop();
});

describe('Pitch Video', () => {
  test('Create', async () => {
    const pitchVideoInput = {
      pitchId: pitch.id,
      video: {
        fileId:
          'https://scroobious-app-development.s3.us-west-2.amazonaws.com/VqUVQ2XqOCLnT5J-_b0R9_example_video.mp4',
      },
    };

    const pitchVideo = await founderBinding.mutation.createPitchVideo(
      { data: pitchVideoInput },
      '{ id pitchId pitch { id } video { wistiaId file { id url } } }'
    );

    expect(pitchVideo.pitchId.length).toBeGreaterThan(10);
    expect(pitchVideo.pitch.id.length).toBeGreaterThan(10);
    expect(pitchVideo.video.wistiaId.length).toBeGreaterThan(7);
    expect(pitchVideo.video.file.url).toMatch(/^http/);
  });
});
