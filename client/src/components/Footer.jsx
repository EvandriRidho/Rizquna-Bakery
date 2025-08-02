import { assets } from "../assets/assets.js"


const Footer = () => {

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-primary/10">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                    <div className="flex items-center">
                        <img className="w-9 md:w-14" src={assets.footer_logo} alt="Logo" />
                        <span className="text-lg md:text-2xl text-primary font-semibold">Rizquna Bakery</span>
                    </div>
                    <p className="max-w-[410px] mt-6">Rizquna Bakery menghadirkan roti dan kue segar setiap hari dengan kualitas terbaik, siap diantar langsung ke rumah Anda dengan cepat dan mudah.</p>
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright {new Date().getFullYear()} © Rizquna Bakery All Right Reserved.
            </p>
        </div>
    );
};

export default Footer