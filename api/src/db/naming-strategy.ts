// Borrowed createNameFromTableColumns from
// https://github.com/appcompass/authorization-microservice/blob/4bf73d93e005ed99ddeea62601876af15250000d/src/db/naming.strategy.ts
import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class MyStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  constructor() {
    super();
  }

  tableName(className: string, customName?: string): string {
    return customName ? customName : snakeCase(className);
  }

  columnName(propertyName: string, customName?: string, embeddedPrefixes: string[] = []): string {
    return (
      snakeCase(embeddedPrefixes.join('_')) + (customName ? customName : snakeCase(propertyName))
    );
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(`${relationName}_${referencedColumnName}`);
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    secondPropertyName: string
  ): string {
    return snakeCase(
      firstTableName + '_' + firstPropertyName.replace(/\./gi, '_') + '_' + secondTableName
    );
  }

  joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
    return snakeCase(tableName + '_' + (columnName ? columnName : propertyName));
  }

  classTableInheritanceParentColumnName(
    parentTableName: any,
    parentTableIdPropertyName: any
  ): string {
    return snakeCase(`${parentTableName} ${parentTableIdPropertyName}`);
  }

  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    return this.createNameFromTableColumns(tableOrName, columnNames, 'PK');
  }

  uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    return this.createNameFromTableColumns(tableOrName, columnNames, 'UQ');
  }

  relationConstraintName(
    tableOrName: Table | string,
    columnNames: string[],
    where?: string
  ): string {
    return this.createNameFromTableColumns(tableOrName, columnNames, 'RC', where);
  }

  foreignKeyName(tableOrName: Table | string, columnNames: string[]): string {
    return this.createNameFromTableColumns(tableOrName, columnNames, 'FK');
  }

  indexName(tableOrName: Table | string, columnNames: string[], where?: string): string {
    return this.createNameFromTableColumns(tableOrName, columnNames, 'IDX', where);
  }

  private createNameFromTableColumns(
    tableOrName: Table | string,
    columnNames: string[],
    prefix: string,
    where?: string
  ) {
    const clonedColumnNames = [...columnNames];

    clonedColumnNames.sort();

    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;
    const replacedTableName = table.replace('.', '_');
    const replacedColumnNames = clonedColumnNames.join('+');
    const suffix = where ? '_' + where : '';

    return snakeCase(
      `${prefix} ${replacedTableName} ${replacedColumnNames}${suffix}`
    ).toLowerCase();
  }
}
