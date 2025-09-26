default:
    @just --choose

gen-entities:
    sea-orm-cli generate entity -o ./backend/crates/chatara/src/entity --with-serde both 
