import VendorByCategory from "@/sections/Home/VendorByCategory";
import VendorListPage from "@/sections/Location/VendorListPage";
import PreviewProfile from "@/sections/Vendor/PreviewProfile/PreviewProfile";
import WeddingVendor from "@/sections/WeddingVendors/WeedingVendor";

export default function VendorDetailPage({ params }) {
    // return <PreviewProfile params={params} />;
    return <VendorByCategory params={params} />;
    //  return <VendorListPage params={params} />;


   
}