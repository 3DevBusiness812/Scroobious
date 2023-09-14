import axios from 'axios';
import lodashTemplate from 'lodash.template';
import { Inject, Service } from 'typedi';
import { ConfigService, getContainer } from '../../../core';
const FormData = require('form-data');

const WISTIA_SUCCESS_PAYLOAD = {
  data: {
    id: 84824945,
    name: 'VqUVQ2XqOCLnT5J-_b0R9_example_video.mp4',
    type: 'Video',
    created: '2022-01-29T20:55:55+00:00',
    updated: '2022-01-29T20:55:55+00:00',
    hashed_id: 'hn3jrejwpy', // The test video on Wistia
    description: '',
    progress: 0,
    status: 'queued',
    thumbnail: {
      url: 'https://fast.wistia.com/assets/images/zebra/elements/dashed-thumbnail.png',
      width: 200,
      height: 120,
    },
    account_id: 988989,
  },
};

@Service('WistiaService')
export class WistiaService {
  WISTIA_UPLOAD_URL = 'https://upload.wistia.com';
  WISTIA_STATS_URL = lodashTemplate('https://api.wistia.com/v1/stats/medias/<%= videoId %>.json');

  testMode: boolean;
  params: any;

  constructor(@Inject('ConfigService') public readonly config: ConfigService) {
    this.testMode = process.env.NODE_ENV === 'test';

    if (!this.config.get('WISTIA_ACCESS_TOKEN')) {
      throw new Error('Wistia access token not found');
    }

    return this;
  }

  async getIframes(videoId: string) {

    const events = await axios.get(`https://api.wistia.com/v1/stats/events.json?media_id=${videoId}`, {
      headers: {
        Authorization: 'Bearer ' + process.env.WISTIA_STATS_TOKEN,
      }
    })

    console.log('[Extra DEBUG]', events.data);


    let iframes: any[] = [];

    for (let index = 0; index < events.data.length; index++) {
      const element = events.data[index].iframe_heatmap_url;
      iframes = [...iframes, { url: element }];

    }

    console.log('[Extra DEBUG]', iframes);

    return iframes;
  }

  async getStats(videoId: string) {
    const videoUrl = this.WISTIA_STATS_URL({
      videoId,
    });



    const res: any = await axios.get(videoUrl, {
      headers: {
        Authorization: 'Bearer ' + process.env.WISTIA_STATS_TOKEN,
      },
    });


    return res.data;
  }

  async uploadByUrl(url: string, videoName?: string): Promise<typeof WISTIA_SUCCESS_PAYLOAD.data> {
    // NOTE: this is an anti-pattern.  I'm mocking this service out for tests by checking
    // to see if we're in test mode here.  We should actually use dependency injection in the
    // tests, but... time.
    if (this.testMode || url === 'id-example-pitch-video-file') {
      return WISTIA_SUCCESS_PAYLOAD.data;
    }

    /////////////////////////
    // Start non-test code
    if (!this.config.get('WISTIA_ACCESS_TOKEN')) {
      throw new Error('Wistia access token not found');
    }
    if (!this.config.get('WISTIA_FOUNDER_VIDEO_PROJECT_ID')) {
      throw new Error('Wistia video project ID not found');
    }

    const formData = new FormData();
    formData.append('access_token', this.config.get('WISTIA_ACCESS_TOKEN'));
    formData.append('url', url);
    formData.append('project_id', this.config.get('WISTIA_FOUNDER_VIDEO_PROJECT_ID'));
    if (videoName) {
      formData.append('name', videoName);
    }

    // console.log('formData :>> ', formData);

    const response = await axios.post(this.WISTIA_UPLOAD_URL, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
      },
    });
    // console.log('wistia response :>> ', response);

    return response.data;
  }
}

// For running directly with ts-node
if (require.main === module) {
  const service = getContainer(WistiaService);

  service
    .getStats('doz13ty1ld')
    .then((result) => {
      // console.log(result);
    })
    .catch((error: Error) => {
      console.error(error);
    })
    .finally(process.exit);
}
