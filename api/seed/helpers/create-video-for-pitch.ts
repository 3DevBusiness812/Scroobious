import { getContainer } from '../../src/core/di';
import { getDBConnection } from '../../src/db/connection';
import { FileService } from '../../src/modules/core/file/file.service';
import { VideoService } from '../../src/modules/core/video/video.service';

export const createVideoForPitch = async function createVideoForPitch() {
  const connection = await getDBConnection();
  const fileService = getContainer(FileService);
  const videoService = getContainer(VideoService);
  const fileId = 'id-example-pitch-video-file';
  const videoId = 'id-example-pitch-video';
  const wistiaId = 'hn3jrejwpy';

  let videoFile = await fileService.findOneSafe({ id: fileId });
  if (!videoFile) {
    await connection.manager.query(`
      INSERT INTO file(id, created_at, created_by_id, version, owner_id, url)
      VALUES ('${fileId}', now(), '1', 1, '1' , 'https://scroobious-app-development.s3.us-west-2.amazonaws.com/id-example-pitch-video.mp4');
    `);

    videoFile = await fileService.findOne({ id: fileId });
  }

  let video = await videoService.findOneSafe({ id: videoId });
  if (video) {
    return video;
  }

  await connection.manager.query(`
    INSERT INTO video(id, created_at, created_by_id, version, owner_id, file_id, wistia_id)
    VALUES ('${videoId}', now(), '1', 1, '1' , '${fileId}', '${wistiaId}');
  `);

  return videoService.findOne({ id: videoId });
};
