use sea_orm_migration::prelude::*;

use crate::m20220101_000001_create_table::CharacterProfilesTable;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // 1) 先确保已有的 name 不重复
        manager
            .get_connection()
            .execute_unprepared(
                r#"
                DELETE FROM character_profiles AS c1
                WHERE ctid <> (
                    SELECT min(ctid)
                    FROM character_profiles AS c2
                    WHERE c2.name = c1.name
                );
                "#,
            )
            .await?;

        // 2) 创建唯一索引 / 唯一约束（PostgreSQL 里两者等价）
        manager
            .create_index(
                Index::create()
                    .name("idx_character_profiles_name_uniq")
                    .table(CharacterProfilesTable::CharacterProfiles)
                    .col(CharacterProfilesTable::Name)
                    .unique()
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // 回滚：删除唯一索引
        manager
            .drop_index(
                Index::drop()
                    .name("idx_character_profiles_name_uniq")
                    .table(CharacterProfilesTable::CharacterProfiles)
                    .to_owned(),
            )
            .await
    }
}
