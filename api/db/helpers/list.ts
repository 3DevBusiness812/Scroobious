import { nanoid } from 'nanoid';

export function getListInsertStatement(
  table: string,
  items: {
    id?: string;
    description: string;
  }[]
) {
  const commands = [];
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    const id = item.id ?? nanoid();

    const command = `
      INSERT INTO "${table}" ("id" , "description", "archived", "created_at", "created_by_id", "updated_at", "updated_by_id")
      VALUES ('${id}', '${item.description.replace(
      /'/,
      "''"
    )}', false, current_timestamp, '1', NULL, NULL);
    `;
    // console.log('command :>> ', command);

    commands.push(command);
  }

  return commands.join('\n');
}
