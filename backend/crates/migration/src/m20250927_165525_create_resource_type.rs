use sea_orm_migration::{
    prelude::{extension::postgres::Type, *},
    schema::enumeration,
};

#[derive(DeriveMigrationName)]
pub struct Migration;
#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_type(
                Type::create()
                    .as_enum(ResourceTypeEnum::ResourceType)
                    .values([ResourceTypeEnum::Audio])
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(AttachedResourcesTable::AttachedResources)
                    .add_column(enumeration(
                        AttachedResourcesTable::ResourceType,
                        ResourceTypeEnum::ResourceType,
                        [ResourceTypeEnum::Audio],
                    ))
                    .to_owned(),
            )
            .await
    }
    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(AttachedResourcesTable::AttachedResources)
                    .drop_column(AttachedResourcesTable::ResourceType)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_type(Type::drop().name(ResourceTypeEnum::ResourceType).to_owned())
            .await
    }
}
#[derive(DeriveIden)]
enum ResourceTypeEnum {
    ResourceType,

    Audio,
}

#[derive(DeriveIden)]
enum AttachedResourcesTable {
    AttachedResources,

    ResourceType,
}
