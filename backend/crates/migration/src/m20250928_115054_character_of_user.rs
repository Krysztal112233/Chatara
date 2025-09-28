use sea_orm_migration::{prelude::*, schema::string};

#[derive(DeriveMigrationName)]
pub struct Migration;

static FK: &str = "fk_character_profiles_belong_user";

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(CharacterProfilesTable::CharacterProfiles)
                    .add_column(string(CharacterProfilesTable::BelongUser))
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name(FK)
                    .from(
                        CharacterProfilesTable::CharacterProfiles,
                        CharacterProfilesTable::BelongUser,
                    )
                    .to(UsersTable::Users, UsersTable::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .on_update(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_foreign_key(
                ForeignKey::drop()
                    .name(FK)
                    .table(CharacterProfilesTable::CharacterProfiles)
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(CharacterProfilesTable::CharacterProfiles)
                    .drop_column(CharacterProfilesTable::BelongUser)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }
}

#[derive(DeriveIden)]
enum CharacterProfilesTable {
    CharacterProfiles,

    BelongUser,
}

#[derive(DeriveIden)]
enum UsersTable {
    Users,

    Id,
}
