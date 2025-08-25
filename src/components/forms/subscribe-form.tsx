export default async function SubscribeNewLetterForm({
    mobileView,
}: {
    mobileView: boolean;
}) {
    if (mobileView) {
        return (
            <div className="hidden sm:hidden md:block">
                <h5 className="text-lg font-semibold border-b border-blue-500 mb-4 pb-1">
                    Subscribe
                </h5>
                <SubscribeForm />
            </div>
        );
    }

    return <SubscribeForm />;
}

export const SubscribeForm = () => {
    return (
        <>
            <p className="text-lg mb-4 text-[#D1D5DB]">
                Stay updated with the latest venues, event trends, and special
                offers.
            </p>
            <form>
                <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    style={{ borderRadius: "5px" }}
                    className={`w-full bg-[#075fac] hover:bg-[#6B9AC4] px-4 py-2 transition`}
                >
                    Subscribe
                </button>
            </form>
        </>
    );
};
