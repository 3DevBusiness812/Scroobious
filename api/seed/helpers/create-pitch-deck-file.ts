import { getContainer } from '../../src/core/di';
import { getDBConnection } from '../../src/db/connection';
import { FileService } from '../../src/modules/core/file/file.service';

export const createPitchDeckFile = async function createPitchDeckFile() {
  const connection = await getDBConnection();
  const fileService = getContainer(FileService);
  const fileId = 'id-example-pitch-deck';

  let deckFile = await fileService.findOneSafe({ id: fileId });
  if (deckFile) {
    return deckFile;
  }

  await connection.manager.query(`
      INSERT INTO file(id, created_at, created_by_id, version, owner_id, url)
      VALUES ('${fileId}', now(), '1', 1, '1' , 'https://www.juniorachievement.org/documents/20009/7204536/JA_HighSchool_Elevator_Pitch.pdf');
    `);

  return fileService.findOne({ id: fileId });
};
