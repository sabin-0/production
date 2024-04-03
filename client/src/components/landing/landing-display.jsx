import React from "react";
import LandingNav from "./landing-nav/landing-nav";
import LandingPage from "./landing-page/landing-page";
import LandingFooter from "./landing-footer/landing-footer";

export default function LandingDisplay() {
    return(
        <>
        <LandingNav/>
        <LandingPage/>
        <LandingFooter/>
        </>
    )
}