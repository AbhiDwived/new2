import VendorByCategory from "@/sections/Home/VendorByCategory";
import WeddingVendor from "@/sections/WeddingVendors/WeedingVendor";
import WeddingVenues from "@/sections/WeddingVenues/WeddingVenues";

export default function VendorsCityPage({ params }) {
    return <WeddingVendor params={params} />;
    // return <VendorByCategory params={params} />;
   
    
}