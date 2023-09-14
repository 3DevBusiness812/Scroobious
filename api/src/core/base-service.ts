import { registerEnumType } from 'type-graphql';
import { DeepPartial, EntityManager, getManager, Repository } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';
import {
  BaseOptions,
  BaseOptionsExtended,
  BaseService as WarthogBaseService,
  IdModel,
  JsonObject,
  StandardDeleteResponse,
} from 'warthog';
import { EventTypeService } from '../modules/subscriptions/event-type/event-type.service';
import { EventService } from '../modules/subscriptions/event/event.service';
import { getContainer } from './di';
import { Logger } from './logger';
const cleanDeep = require('clean-deep');

export type MutateOptions = BaseOptionsExtended & {
  eventType?: string;
};

export enum UpsertAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
}

registerEnumType(UpsertAction, {
  name: 'UpsertAction',
});

export type UpsertResult<E> = {
  data: E;
  action: UpsertAction;
};

function sanitize(data: object | undefined): object | undefined {
  if (typeof data === 'undefined') {
    return undefined;
  }

  return cleanDeep(data, {
    cleanKeys: ['password'],
    emptyArrays: false,
    emptyObjects: false,
    emptyStrings: false,
    NaNValues: false,
    nullValues: false,
    undefinedValues: false,
  }) as object;
}

export class BaseService<E extends IdModel> extends WarthogBaseService<E> {
  private eventService: EventService;
  private eventTypeService: EventTypeService;
  protected logger: Logger;

  constructor(entityClass: any, repository: Repository<E>) {
    super(entityClass, repository);
    this.eventService = getContainer(EventService);
    this.eventTypeService = getContainer(EventTypeService);
    this.logger = getContainer(Logger);
  }

  async shouldPublishEventType(eventType: string): Promise<boolean> {
    return this.eventTypeService.shouldPublish(eventType);
  }

  // Process a create, update or delete, firing a new event if necessary
  async processMutation<T>(
    action: 'create' | 'update' | 'delete',
    mutationFn: Function,
    userId: string,
    data?: object,
    options?: MutateOptions // TODO: use transaction manager passed in instead of creating another one
  ): Promise<T> {
    // console.log('processMutation options :>> ', options);
    const objectType = snakeCase(this.entityClass.name);
    const eventType = options?.eventType
      ? `${objectType}.${options?.eventType}`
      : `${objectType}.${action}`;

    const myself = this; //  eslint-disable-line
    const sanitizedData = sanitize(data);
    // console.log('sanitizedData :>> ', sanitizedData);

    // NOTE: Commented this out.  For now, just publish all events.  There isn't going to be that much data and it might be nice to have access
    // to all of these actions
    // If the event is not registered, just save
    // if (!(await this.shouldPublishEventType(eventType))) {
    //   return mutationFn(null);
    // }

    // Sometimes a transaction manager will already be passed in when mutating with the base model
    // If it is, we should use that.  Otherwise, we'll need to spin up our own transaction here
    // So that we can save the record and the event at the same time.  Since `getManager().transaction`
    // needs to wrap the code block it is transacting on, we create our own wrapper with our transaction
    // so that we can keep the same code structure
    const inputTransactionManager = this.extractManager(options);
    // console.log('inputTransactionManager :>> ', inputTransactionManager);

    if (inputTransactionManager) {
      const baseObj = await mutationFn(inputTransactionManager);
      const sanitizedBaseObj = sanitize(baseObj);

      await (myself.eventService as EventService).create(
        {
          // TODO: provide a way for the create method to specify type
          type: eventType,
          objectType,
          objectId: baseObj.id,
          payload: {
            data: sanitizedData as JsonObject,
            resource: sanitizedBaseObj as unknown as JsonObject,
          },
          ownerId: userId,
        },
        userId,
        {
          manager: inputTransactionManager,
        }
      );

      return baseObj;
    }

    const result = await getManager().transaction(async (manager: EntityManager) => {
      const baseObj = await mutationFn(manager);
      const sanitizedBaseObj = sanitize(baseObj);
      // console.log('sanitizedBaseObj :>> ', sanitizedBaseObj);

      myself.logger.info('New event', sanitizedBaseObj);

      await (myself.eventService as EventService).create(
        {
          // TODO: provide a way for the create method to specify type
          type: eventType,
          objectType,
          objectId: baseObj.id,
          payload: {
            data: sanitizedData as JsonObject,
            resource: sanitizedBaseObj as unknown as JsonObject,
          },
          ownerId: userId,
        },
        userId,
        {
          manager,
        }
      );

      return baseObj;
    });

    return result;
  }

  async create(data: DeepPartial<E>, userId: string, options?: MutateOptions): Promise<E> {
    const mutationFn = (manager: any) => {
      return super.create(data, userId, { manager });
    };

    return this.processMutation('create', mutationFn, userId, data, options);
  }

  async update(
    data: DeepPartial<E>,
    where: any,
    userId: string,
    options?: MutateOptions
  ): Promise<E> {
    const mutationFn = (manager: any) => {
      // console.log(
      //   `Calling super.update with ${JSON.stringify(data)} | ${JSON.stringify(where)} | ${userId}`
      // );
      return super.update(data, where, userId, { manager });
    };

    return this.processMutation('update', mutationFn, userId, data, options);
  }

  async delete(where: any, userId: string, options?: BaseOptions): Promise<StandardDeleteResponse> {
    const mutationFn = (manager: any) => {
      return super.delete(where, userId, { manager });
    };

    return this.processMutation('delete', mutationFn, userId, where, options);
  }

  async createIfNotExists<E extends Node>(
    whereData: any,
    additionalData: any = {},
    userId: string
  ) {
    // const modified = {} as any;
    // Object.keys(whereData).forEach(element => {
    //   modified[`${element}_eq`] = (whereData as any)[element];
    // });

    // console.log('modified :>> ', modified);

    const items = await this.find(whereData);
    if (items.length) {
      // console.log(`Item already exists.`, items[0]);
      return items[0];
    }

    const createObject = { ...whereData, ...additionalData };

    // console.log('createObject', createObject);
    return this.create(createObject, userId);
  }

  async findSingle<W>(where: W): Promise<E | null> {
    const results = await super.find(where);
    if (results.length) {
      return results[0];
    }

    return null;
  }

  // async query(
  //   where: any = {}, // TODO: fix any
  //   userId: string,
  //   options: {
  //     orderBy?: string
  //     limit?: number
  //     offset?: number
  //     fields?: string[]
  //     qbModifier?: (qb: SelectQueryBuilder<E>) => void
  //   } = {},
  // ): Promise<E[]> {
  //   const DEFAULT_LIMIT = 50
  //   // https://github.com/typeorm/typeorm/blob/master/docs/select-query-builder.md
  //   const qb = this.buildFindQuery(
  //     where as WhereExpression,
  //     options.orderBy,
  //     { limit: options.limit || DEFAULT_LIMIT, offset: options.offset },
  //     options.fields,
  //   )

  //   if (options.qbModifier) {
  //     options.qbModifier(qb)
  //   }

  //   return qb.getMany()
  // }

  async upsert(
    inputData: DeepPartial<E>,
    where: any,
    userId: string,
    options?: MutateOptions
  ): Promise<UpsertResult<E>> {
    // let found;
    // console.log(`inputData`, inputData);
    // console.log(`where`, where);

    let data: E;
    let action: UpsertAction;

    try {
      await this.findOne<any>(where);
      // console.log(`found`, found);

      data = await this.update(inputData, where, userId, options);
      action = UpsertAction.UPDATE;
    } catch (error) {
      data = await this.create(inputData, userId, options);
      // console.log('upsert data :>> ', data);
      action = UpsertAction.CREATE;
    }

    return { data, action };
  }

  async findOneSafe<W>(
    where: W,
    userId?: string,
    options?: BaseOptionsExtended
  ): Promise<E | undefined> {
    const items = await this.find(
      where as any,
      undefined,
      undefined,
      undefined,
      undefined,
      userId,
      options
    );
    if (!items.length) {
      return;
    }

    return items[0];
  }
}
