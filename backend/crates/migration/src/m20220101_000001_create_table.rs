use sea_orm_migration::{
    prelude::{extension::postgres::Type, *},
    schema::{enumeration, json_binary, pk_uuid, string, timestamp_with_time_zone, uuid},
};

#[derive(DeriveMigrationName)]
pub struct Migration;

static FK_H_INDEX_USER_REF: &str = "fk_h_index_user_ref";
static FK_H_INDEX_CHAR_P_REF: &str = "fk_h_index_char_p_ref";
static FK_HISTORY_H_INDEX_REF: &str = "fk_history_h_index_ref";

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // -------- enum --------
        manager
            .create_type(
                Type::create()
                    .as_enum(ChatRoleEnum::ChatRole)
                    .values([
                        ChatRoleEnum::System,
                        ChatRoleEnum::User,
                        ChatRoleEnum::Character,
                    ])
                    .to_owned(),
            )
            .await?;
        // -------- users --------
        manager
            .create_table(
                Table::create()
                    .if_not_exists()
                    .table(UsersTable::Users)
                    .col(ColumnDef::new(UsersTable::Id).string().primary_key())
                    .to_owned(),
            )
            .await?;
        // -------- character_profiles --------
        manager
            .create_table(
                Table::create()
                    .if_not_exists()
                    .table(CharacterProfilesTable::CharacterProfiles)
                    .col(pk_uuid(CharacterProfilesTable::Id))
                    .col(timestamp_with_time_zone(CharacterProfilesTable::CreatedAt))
                    .col(string(CharacterProfilesTable::Name))
                    .col(json_binary(CharacterProfilesTable::Settings))
                    .to_owned(),
            )
            .await?;
        // -------- history_indexes --------
        manager
            .create_table(
                Table::create()
                    .if_not_exists()
                    .table(HistoryIndexesTable::HistoryIndexes)
                    .col(pk_uuid(HistoryIndexesTable::Id))
                    .col(timestamp_with_time_zone(HistoryIndexesTable::CreatedAt))
                    .col(string(HistoryIndexesTable::BelongUser))
                    .col(uuid(HistoryIndexesTable::BelongCharacterProfile))
                    .to_owned(),
            )
            .await?;
        // -------- histories --------
        manager
            .create_table(
                Table::create()
                    .if_not_exists()
                    .table(HistoriesTable::Histories)
                    .col(pk_uuid(HistoriesTable::Id))
                    .col(timestamp_with_time_zone(HistoriesTable::CreatedAt))
                    .col(enumeration(
                        HistoriesTable::ChatRole,
                        ChatRoleEnum::ChatRole,
                        [
                            ChatRoleEnum::System,
                            ChatRoleEnum::Character,
                            ChatRoleEnum::User,
                        ],
                    ))
                    .col(uuid(HistoriesTable::BelongHistoryIndex))
                    .col(string(HistoriesTable::Content))
                    .to_owned(),
            )
            .await?;
        // -------- FK --------
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name(FK_H_INDEX_CHAR_P_REF)
                    .from(
                        HistoryIndexesTable::HistoryIndexes,
                        HistoryIndexesTable::BelongCharacterProfile,
                    )
                    .to(
                        CharacterProfilesTable::CharacterProfiles,
                        CharacterProfilesTable::Id,
                    )
                    .on_delete(ForeignKeyAction::Cascade)
                    .on_update(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name(FK_H_INDEX_USER_REF)
                    .from(
                        HistoryIndexesTable::HistoryIndexes,
                        HistoryIndexesTable::BelongUser,
                    )
                    .to(UsersTable::Users, UsersTable::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .on_update(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name(FK_HISTORY_H_INDEX_REF)
                    .from(
                        HistoriesTable::Histories,
                        HistoriesTable::BelongHistoryIndex,
                    )
                    .to(HistoryIndexesTable::HistoryIndexes, HistoryIndexesTable::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .on_update(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;
        Ok(())
    }
    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // 按依赖逆序删除即可
        manager
            .drop_foreign_key(
                ForeignKey::drop()
                    .name(FK_HISTORY_H_INDEX_REF)
                    .table(HistoriesTable::Histories)
                    .to_owned(),
            )
            .await?;
        manager
            .drop_foreign_key(
                ForeignKey::drop()
                    .name(FK_H_INDEX_CHAR_P_REF)
                    .table(HistoryIndexesTable::HistoryIndexes)
                    .to_owned(),
            )
            .await?;
        manager
            .drop_foreign_key(
                ForeignKey::drop()
                    .name(FK_H_INDEX_USER_REF)
                    .table(HistoryIndexesTable::HistoryIndexes)
                    .to_owned(),
            )
            .await?;
        manager
            .drop_table(Table::drop().table(HistoriesTable::Histories).to_owned())
            .await?;
        manager
            .drop_table(
                Table::drop()
                    .table(HistoryIndexesTable::HistoryIndexes)
                    .to_owned(),
            )
            .await?;
        manager
            .drop_table(
                Table::drop()
                    .table(CharacterProfilesTable::CharacterProfiles)
                    .to_owned(),
            )
            .await?;
        manager
            .drop_table(Table::drop().table(UsersTable::Users).to_owned())
            .await?;
        manager
            .drop_type(Type::drop().name(ChatRoleEnum::ChatRole).to_owned())
            .await?;
        Ok(())
    }
}

#[derive(DeriveIden)]
enum UsersTable {
    Users,

    Id,
}

#[derive(DeriveIden)]
enum CharacterProfilesTable {
    CharacterProfiles,

    Id,

    /// 创建日期
    CreatedAt,

    /// 角色名
    Name,

    /// 角色的各方面配置，比如角色性格等等等
    Settings,
}

#[derive(DeriveIden)]
enum ChatRoleEnum {
    ChatRole,

    /// 系统角色
    ///
    /// 用于提供角色名，基础的世界观，角色的性格等信息
    System,

    /// 角色
    ///
    /// 来自大模型扮演的角色的输出
    Character,

    /// 用户
    ///
    /// 用户的输入
    User,
}

#[derive(DeriveIden)]
enum HistoryIndexesTable {
    HistoryIndexes,

    Id,

    CreatedAt,

    /// 使用了哪儿个角色的配置文件
    BelongCharacterProfile,

    /// 属于哪儿个用户的
    BelongUser,
}

#[derive(DeriveIden)]
enum HistoriesTable {
    Histories,

    Id,

    /// 创建于
    CreatedAt,

    /// 当前聊天记录的聊天角色
    ChatRole,

    /// 属于哪儿个索引
    BelongHistoryIndex,

    /// 聊天内容
    Content,
}
