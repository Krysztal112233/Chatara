use sea_orm_migration::{
    prelude::*,
    schema::{pk_uuid, string, uuid_null},
};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // 1. 创建 attached_resources 表
        manager
            .create_table(
                Table::create()
                    .table(AttachedResourcesTable::AttachedResources)
                    .if_not_exists()
                    .col(pk_uuid(AttachedResourcesTable::Id))
                    .col(string(AttachedResourcesTable::Path))
                    .to_owned(),
            )
            .await?;

        // 2. 为 histories 表新增一列 with_resource，外键到 attached_resources.id
        manager
            .alter_table(
                Table::alter()
                    .table(HistoriesTable::Histories)
                    .add_column(uuid_null(HistoriesTable::WithResource))
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_histories_attached_resources")
                    .from(HistoriesTable::Histories, HistoriesTable::WithResource)
                    .to(
                        AttachedResourcesTable::AttachedResources,
                        AttachedResourcesTable::Id,
                    )
                    .on_delete(ForeignKeyAction::SetNull)
                    .on_update(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // 逆操作：先删外键再删列再删表（以防顺序错乱）
        manager
            .drop_foreign_key(
                ForeignKey::drop()
                    .name("fk_histories_attached_resources")
                    .table(HistoriesTable::Histories)
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(HistoriesTable::Histories)
                    .drop_column(HistoriesTable::WithResource)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_table(
                Table::drop()
                    .table(AttachedResourcesTable::AttachedResources)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }
}

#[derive(DeriveIden)]
enum HistoriesTable {
    Histories,
    WithResource,
}

#[derive(DeriveIden)]
enum AttachedResourcesTable {
    AttachedResources,

    Id,
    Path,
}
