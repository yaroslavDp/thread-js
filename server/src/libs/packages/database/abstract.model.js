import { Model } from 'objection';

class Abstract extends Model {
  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        deletedAt: { type: ['string', 'null'] }
      }
    };
  }

  $beforeInsert() {
    const date = new Date().toISOString();
    this.createdAt = date;
    this.updatedAt = date;
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

export { Abstract };
