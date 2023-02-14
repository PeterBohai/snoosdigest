import React from "react";

import HomeWrapper from "../components/home/HomeWrapper";
import HackernewsHome from "../components/home/HomePanelHackernews";

export default function HomeScreenHackernews() {
    return (
        <HomeWrapper tabName={"hackernews"}>
            <HackernewsHome />
        </HomeWrapper>
    );
}
