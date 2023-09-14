import { IDType } from 'warthog';

export interface LookupModel {
  id: IDType;
  description: string;
  archived: boolean;
}

// import { ObjectType } from 'type-graphql';
// import {
//   BooleanField,
//   CreatedAtField,
//   CreatedByField,
//   IdModel,
//   IDType,
//   PrimaryIdField,
//   UpdatedAtField,
//   UpdatedByField,
// } from 'warthog';

// // type-graphql requires you set this as ObjectType for it's inheritance to work
// @ObjectType({ isAbstract: true })
// export class LookupModel extends IdModel {
//   // Overloading as we don't want this filter
//   @PrimaryIdField()
//   id!: IDType;

//   // Require code and description in
//   code!: string;
//   description!: string;

//   @BooleanField({ filter: ['eq'] })
//   archived!: boolean;

//   @CreatedAtField()
//   createdAt!: Date;

//   @CreatedByField()
//   createdById!: IDType;

//   @UpdatedAtField()
//   updatedAt!: Date;

//   @UpdatedByField()
//   updatedById!: IDType;
// }
