"use client";

import VoiceToTextBrainstorming from "@/components/VoiceToTextBrainstorming";
import React from "react";
import ActivityKonfigurator from "@/components/ActivityKonfigurator";
import ActivitySuggestions from "@/components/ActivitySuggestions";

const UseCase1Page = () => {
  return (
    <div className="container py-12">
      <VoiceToTextBrainstorming />
      <ActivityKonfigurator />
      <ActivitySuggestions />
    </div>
  );
};

export default UseCase1Page;
