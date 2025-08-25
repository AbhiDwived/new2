import VendorListPage from "@/sections/Location/VendorListPage";
<<<<<<< HEAD
import PreviewProfile from "@/sections/Vendor/PreviewProfile/PreviewProfile";
=======
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90

export default async function VendorsCategoryCityPage({ params }) {
    const resolvedParams = await params;
    const { category } = resolvedParams;
    
    // If category looks like a vendor slug (contains hyphens and location info)
    if (category && category.includes('-in-')) {
        return <PreviewProfile params={Promise.resolve({ ...resolvedParams, vendor: category })} />;
    }
    
    return <VendorListPage params={Promise.resolve(resolvedParams)} />;
}