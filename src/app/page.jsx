import DiscoverCategories from "@/sections/Home/DiscoverCategories";
import FeaturedVendors from "@/sections/Home/FeatureVendors";
import HowItWorks from "@/sections/Home/HowItWorks";
import ProjectList from "@/sections/Home/ProjectList";
import SuccessfullEvents from "@/sections/Home/SuccessfullEvents";
import TestimonialSection from "@/sections/Home/Tesstimonials";
import VendorByCategory from "@/sections/Home/VendorByCategory";
import WeddingVenuesByLocation from "@/sections/Home/WeddingVenuesByLocation";

export const dynamic = 'force-dynamic';

export default function Home() {
    return (
        <div>
            {/* SSR done */}
            <DiscoverCategories />
            <WeddingVenuesByLocation />
            <VendorByCategory />
            <FeaturedVendors />
            <ProjectList />
            <SuccessfullEvents />
            <TestimonialSection />
            <HowItWorks />
            {/* <LocationList/> */}
        </div>
    );
}
