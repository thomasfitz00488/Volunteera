import { route } from "@react-router/dev/routes";

export default [
    route("/", "./pages/Home.jsx"),
    route("/browse", "./pages/BrowseOpportunities.jsx"),
    route("/opportunity/:id/discussions", "./pages/OpportunityDiscussions.jsx"),
    route("/opportunity/:id", "./pages/OpportunityDetails.jsx"),
    route("/login", "./pages/Login.jsx"),
    route("/register", "./pages/Register.jsx"),
    route("/register/volunteer", "./pages/VolunteerRegister.jsx"),
    route("/register/organization", "./pages/OrganizationRegister.jsx"),
    route("/verify-organization", "./pages/OrganizationVerify.jsx"),
    route("/about", "./pages/AboutUs.jsx"),
    route("/opportunities/create", "./pages/CreateOpportunity.jsx"),
    route("/dashboard", "./pages/Dashboard.jsx"),
    route("/dashboard/volunteer/:id", "./components/VolunteerDashboard.jsx"),
    route("/friends", "./pages/Friends.jsx"),
    route("/leaderboard", "./pages/Leaderboard.jsx"),
    route("/opportunity/:id/pending", "./pages/OpportunityPendingApplications.jsx"),
    route("/badges", "./pages/Badges.jsx"),
    route("/opportunity/:id/edit", "./pages/EditOpportunity.jsx"),
    route("/volunteer/:id/settings", "./pages/VolunteerSettings.jsx"),
    
];
