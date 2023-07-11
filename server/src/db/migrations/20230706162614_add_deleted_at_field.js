const TableName = {
    POSTS: 'posts'
};
const ColumnName = {
    DELETED_AT: 'deleted_at'
  };
export async function up(knex){
    await knex.schema.table(TableName.POSTS, table => {
        table.dateTime(ColumnName.DELETED_AT);
    });
}

export async function down(knex){
    await knex.schema.alterTable(TableName.POSTS, table => {
        table.dropColumn(ColumnName.DELETED_AT);
    });
}
