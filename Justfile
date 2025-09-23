default:
    @just --choose

gen-entities:
    sea-orm-cli generate entity -o ./backend/crates/charata/src/entity --with-serde both 
