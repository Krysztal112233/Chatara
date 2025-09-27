use rocket::{fairing::AdHoc, routes};

pub struct AgentEndpoint;

impl AgentEndpoint {
    pub fn stage() -> AdHoc {
        AdHoc::on_ignite(
            "Agent Endpoint",
            |r| async move { r.mount("/agent", routes![]) },
        )
    }
}
