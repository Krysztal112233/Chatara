pub use sea_orm_migration::prelude::*;

mod m20220101_000001_create_table;
mod m20250924_163940_assign_unique_name_to_char_prof;
mod m20250924_174510_add_updated_at_to_history_indexes;
mod m20250926_173725_user_created_at;
mod m20250927_164107_create_attached_resources;
mod m20250927_165525_create_resource_type;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_create_table::Migration),
            Box::new(m20250924_163940_assign_unique_name_to_char_prof::Migration),
            Box::new(m20250924_174510_add_updated_at_to_history_indexes::Migration),
            Box::new(m20250926_173725_user_created_at::Migration),
            Box::new(m20250927_164107_create_attached_resources::Migration),
            Box::new(m20250927_165525_create_resource_type::Migration),
        ]
    }
}
