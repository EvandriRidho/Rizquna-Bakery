import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext'

const BestSeller = () => {

    const { products } = useAppContext()

    return (
        <div className='mt-16'>
            <p className='text-2xl md:text-3xl font-medium'>Pilihan Terpopuler</p>
            <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 mt-6 gap-3 md:gap-6 lg:grid-cols-5'>
                {products.filter((product) => product.inStock).slice(0, 5).map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default BestSeller