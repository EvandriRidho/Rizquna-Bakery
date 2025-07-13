import Banner from "../components/Banner"
import BestSeller from "../components/BestSeller"
import Categories from "../components/Categories"


const Home = () => {
    return (
        <div className="mt-10">
            <Banner />
            <Categories />
            <BestSeller />
        </div>
    )
}

export default Home