import SearchResults from "@/sections/SearchResults/SearchResults";

export const dynamic = 'force-dynamic';

export default function SearchPage({params}) {
    return <SearchResults params={params}/>;
}
