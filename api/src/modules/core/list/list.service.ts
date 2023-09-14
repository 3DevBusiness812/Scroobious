import { Field, InputType, ObjectType } from 'type-graphql';
import { Service } from 'typedi';
import { EntityManager, getManager } from 'typeorm';

@InputType()
export class ListWhereInput {
  @Field(() => [String])
  listName_in!: string[];
}

@ObjectType()
export class ListItem {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: false })
  code!: string;

  @Field(() => String, { nullable: false })
  description!: string;

  @Field(() => Boolean, { nullable: false })
  archived!: boolean;
}

@ObjectType()
export class List {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => [ListItem], { nullable: false })
  items!: ListItem[];
}

@Service('ListService')
export class ListService {
  manager!: EntityManager;
  allListNames = [
    'accreditation_status',
    'company_role',
    'company_stage',
    'corporate_structure',
    'country',
    'disability',
    'ethnicity',
    'funding_status',
    'gender',
    'industry',
    'investor_type',
    'perk_category',
    'presentation_status',
    'pronoun',
    'revenue',
    'sexual_orientation',
    'state_province',
    'suggested_resource_category',
    'transgender',
    'working_status',
    'criteria',
  ];

  constructor() {}

  async getManager(): Promise<EntityManager> {
    if (!this.manager) {
      this.manager = await getManager();
    }
    return this.manager;
  }

  // PERFORMANCE: we need to cache/memoize here instead of fetching with every request
  async find(where: ListWhereInput): Promise<List[]> {
    const inputLists = new Set(where.listName_in);
    const allLists = new Set(this.allListNames);
    const difference = new Set([...inputLists].filter((x) => !allLists.has(x)));

    if (difference.size > 0) {
      throw new Error(`Unknown entries: ${Array.from(difference)}`);
    }

    const manager = await this.getManager();

    const sql = where.listName_in
      .map((name: string) => {
        return `
        SELECT '${name}' as list_name, id AS code, '${name.toLowerCase()}' || '__' || id AS id, description, archived
        FROM ${name}
      `;
      })
      .join('\nUNION ALL\n');

    const results = await manager.query(sql);

    let currentListName;
    let currentList;
    const lists: List[] = [];

    for (let index = 0; index < results.length; index++) {
      const item = results[index];
      if (currentListName !== item.list_name) {
        currentListName = item.list_name;

        lists.push({
          id: currentListName,
          name: currentListName,
          items: [] as ListItem[],
        });
        currentList = lists[lists.length - 1];
      }

      if (!currentList) {
        throw new Error("This shoudn't happen");
      }

      currentList.items.push({
        id: item.id,
        code: item.code,
        description: item.description,
        archived: item.archived,
      });
    }
    // console.log('lists :>> ', JSON.stringify(lists, undefined, 2));

    return lists;
  }
}
