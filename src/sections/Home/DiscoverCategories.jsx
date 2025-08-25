import DiscoverVenueHomeCTA from '@/components/ui/discover-venue';
import BrowseVenues from '../WeddingVenues/BrowserVenues';
import Link from 'next/link';

const DiscoverCategories = () => {

  return (
    <div className="w-full">
      <div
        className="w-full h-[525px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 76, 129, 0.7), rgba(26, 42, 58, 0.8)), url(/newPics/discoverImage.jpg)`,
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-extrabold text-white text-4xl md:text-5xl lg:text-6xl mb-6">
            Discover Your Perfect Venue
          </h1>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Connect with trusted professionals for weddings, corporate events, and special occasions.
          </p>

          <DiscoverVenueHomeCTA />

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <Link
              href='/contact-us'
              style={{borderRadius:'5px', textDecoration:'none'}}
              className="px-6 py-2 bg-white/10 text-white border border-white rounded-md backdrop-blur-sm hover:text-black hover:bg-white/20 transition-colors text-lg"
            >
              Contact Us
            </Link>
            <a
              href="/about"
              style={{textDecoration:'none'}}
              className="px-6 py-2 bg-[#445D7B] text-white border border-white rounded-md hover:bg-[#3a4f6a] transition-colors text-lg"
            >
              About
            </a>
          </div>
        </div>
      </div>

      {/* Browse Venues Section */}
      <div className="w-full">
        <BrowseVenues />
      </div>
    </div>
  );
};

export default DiscoverCategories;
