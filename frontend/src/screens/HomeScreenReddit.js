import React from "react";

import HomeWrapper from "../components/home/HomeWrapper";
import RedditHome from "../components/home/HomePanelReddit";

export default function HomeScreenHackernews() {
    return (
        <HomeWrapper tabName={"reddit"}>
            <RedditHome />
        </HomeWrapper>
    );
}
