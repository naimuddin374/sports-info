import { get, set } from 'lodash';
import { mangleString } from '../../utils';

export interface TransformResult {
  data: any;
  external_id: string;
  id: string;
  type?: string;
}

/**
 * Transform livescore API data into a format suitable for database indexing.
 */
export class BaseTransformer {
  /**
   * Path inside an entity to id fields which should be mapped, . separated
   */
  MANGLE_ID_FIELDS: string[] = [];

  /**
   * Path to ID field, mapped to external_id
   */
  ID_PATH = null;

  /**
   * If true, mangle the base id
   */
  MANGLE_ID = true;

  /**
   * Path to the array of entities inside the response
   */
  ENTITY_PATH = 'DATA';

  /**
   * If true, treat entity as a single collection
   */
  COLLECT = false;

  /**
   * If true, treat entity as a single record
   */
  SINGLE = false;

  /**
   * Process a full api result
   * @param data
   */
  processData(data: any, idOverride?: string): TransformResult[] {
    const entities = this.ENTITY_PATH ? get(data, this.ENTITY_PATH, []) : data;
    if (this.SINGLE) {
      return [this.processEntity(entities, idOverride)];
    } else if (this.COLLECT) {
      const id = idOverride || get(data, this.ID_PATH, null);
      return [
        {
          data: entities.map((entity) => this.mapIds(entity)),
          id: this.MANGLE_ID ? this.mangleId(id) : id,
          external_id: id,
        },
      ];
    } else {
      return entities.map((entity) => {
        return this.processEntity(entity, idOverride);
      });
    }
  }

  /**
   * Process a single entity; override in subclasses to transform the internal structure
   * @param data
   */
  processEntity(entity: any, idOverride?: string): TransformResult {
    const id = idOverride || get(entity, this.ID_PATH, null);
    return {
      data: this.mapIds(entity),
      id: this.MANGLE_ID ? this.mangleId(id) : id,
      external_id: id,
    };
  }

  /**
   * Mangle ids for business reasons. Handles single ids and arrays of ids
   *
   * @param data
   */
  mapIds(data: any) {
    this.MANGLE_ID_FIELDS.forEach((path) => {
      const fields = path.split('.');

      // recursively map thru arrays
      const mapField = (subdata, i) => {
        let value;
        if (i == fields.length) {
          value = subdata;
        } else {
          value = get(subdata, fields[i]);
        }

        if (value === undefined) {
          return undefined;
        }

        if (Array.isArray(value)) {
          value = value.map((e) => mapField(e, i + 1));
        } else if (i == fields.length) {
          return mangleString(value);
        } else {
          value = mapField(value, i + 1);
        }

        set(subdata, fields[i], value);
        return subdata;
      };

      mapField(data, 0);
    });

    return data;
  }

  mangleId(id: string) {
    if (id === null || id === undefined || !this.MANGLE_ID) {
      return id;
    }

    return mangleString(id);
  }
}
