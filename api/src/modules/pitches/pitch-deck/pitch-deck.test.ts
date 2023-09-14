import 'reflect-metadata';
import { Binding } from '../../../../generated/binding';
import { createFounderSetup } from '../../../../test/common';
import { TestServerService } from '../../../../test/server';
import { callAPISuccess, getContainer } from '../../../core';

let testServer: TestServerService;
let founderBinding: Binding;

beforeAll(async () => {
  testServer = await getContainer(TestServerService).start();

  ({ founderBinding } = await callAPISuccess(createFounderSetup(testServer)));
});

afterAll(async () => {
  await testServer.stop();
});

describe('Pitch Deck', () => {
  test('Create', async () => {
    const pitch = await founderBinding.mutation.createPitch({ data: {} }, '{ id }');
    const data = {
      pitchId: pitch.id,

      file: {
        url: 'http://www.foo.bar/baz.pdf',
      },
    };

    const pitchDeck = await founderBinding.mutation.createPitchDeck(
      { data },
      '{ id ownerId pitch { id userId createdAt } file { id url } }'
    );

    expect(pitchDeck.pitch.id.length).toBeGreaterThan(10);
    expect(pitchDeck.file.url).toMatch(/^http/);
  });
});
