use client";

import React from "react";
import ActivityKonfigurator from "@/components/ActivityKonfigurator";
import ActivitySuggestions from "@/components/ActivitySuggestions";

const UseCase1Page = () => {
    return (
        <div className="container py-12">
            <ActivityKonfigurator />
            <ActivitySuggestions />
        </div>
    );
};

export default UseCase1Page;
