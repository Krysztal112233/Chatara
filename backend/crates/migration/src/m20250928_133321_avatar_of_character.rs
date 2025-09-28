use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(CharacterProfilesTable::CharacterProfiles)
                    .add_column(string_null(CharacterProfilesTable::Avatar))
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(CharacterProfilesTable::CharacterProfiles)
                    .drop_column(CharacterProfilesTable::Avatar)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }
}

#[derive(DeriveIden)]
enum CharacterProfilesTable {
    CharacterProfiles,

    Avatar,
}
