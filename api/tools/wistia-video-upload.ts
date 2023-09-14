import axios from 'axios';
const FormData = require('form-data');

const WISTIA_ACCESS_TOKEN = process.env.WISTIA_ACCESS_TOKEN;
const WISTIA_UPLOAD_URL = 'https://upload.wistia.com';
// const rickRollVideo = 'https://scroobious-app-development.s3.us-west-2.amazonaws.com/video/example_video.mp4';
const rickRollVideo =
  'https://scroobious-app-development.s3.us-west-2.amazonaws.com/video/example_video_long.mp4';
const WISTIA_FOUNDER_VIDEO_PROJECT_ID = 'iwc9bd36sj'; // DEVELOPMENT (PRODUCTION = 2pjl1qv3l2)

// https://scroobious-app-development.s3.us-west-2.amazonaws.com/video/example_video_10mb.mp4
// https://scroobious-app-development.s3.us-west-2.amazonaws.com/video/example_video_long.mp4

const data = new FormData();
data.append('access_token', WISTIA_ACCESS_TOKEN);
data.append('url', rickRollVideo);
data.append('project_id', WISTIA_FOUNDER_VIDEO_PROJECT_ID);
data.append('name', 'Founder AAA Video');

// console.log('data :>> ', data);

axios
  .post(WISTIA_UPLOAD_URL, data, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`,
    },
  })
  .then(function (response) {
    // console.log(response);
  })
  .catch(function (error) {
    // console.log(error);
  });

// id: 84804718,
// name: 'Founder AAA Video',
// type: 'Video',
// created: '2022-01-29T05:36:33+00:00',
// updated: '2022-01-29T05:36:33+00:00',
// hashed_id: 'f06u8epb7i',
// description: '',
// progress: 0,
// status: 'queued',
// thumbnail: {
//   url: 'https://fast.wistia.com/assets/images/zebra/elements/dashed-thumbnail.png',
//   width: 200,
//   height: 120
// },
// account_id: 988989
