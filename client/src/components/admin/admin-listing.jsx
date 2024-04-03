import React from "react";
import AdminListingPage from "./admin-listing-page/admin-listing-page";
import LandingNav from "../landing/landing-nav/landing-nav";

export default function AdminListing() {
    return(
        <>
            <LandingNav/>
            <AdminListingPage/>
        </>
    )
}