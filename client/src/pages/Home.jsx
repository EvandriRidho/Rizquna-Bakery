import Banner from "../components/Banner"
import BestSeller from "../components/BestSeller"
import BottomBanner from "../components/BottomBanner"
import Categories from "../components/categories"
import NewsLetter from "../components/NewsLetter"

const Home = () => {
    return (
        <div className="mt-10">
            <Banner />
            <Categories />
            <BestSeller />
            <BottomBanner />
            <NewsLetter />
        </div>
    )
}

export default Home