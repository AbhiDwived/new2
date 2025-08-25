"use client"

import PreviewProfile from "@/sections/Vendor/PreviewProfile/PreviewProfile";

export default function VenuePage({ params }) {
    // This route handles individual venue pages like /venue/agra/orchid-in-taj-nagri-phase-2-sector-a
    return <PreviewProfile params={params} />;
}