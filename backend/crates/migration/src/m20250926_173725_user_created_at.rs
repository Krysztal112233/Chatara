use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(UsersTable::Users)
                    .add_column(
                        ColumnDef::new(UsersTable::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await
    }
    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(UsersTable::Users)
                    .drop_column(UsersTable::CreatedAt)
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum UsersTable {
    Users,

    CreatedAt,
}
