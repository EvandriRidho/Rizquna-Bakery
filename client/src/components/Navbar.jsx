import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import { useAppContext } from '../context/AppContext.jsx'
import toast from 'react-hot-toast'

const Navbar = () => {
    const [open, setOpen] = React.useState(false)
    const { user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios } = useAppContext()


    const logout = async () => {
        try {
            const { data } = await axios.get('/api/user/logout')
            if (data.success) {
                toast.success(data.message)
                setUser(null)
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate('/products')
        }
    }, [searchQuery])

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to={'/'} onClick={() => setOpen(false)}>
                <div className='flex items-center'>
                    <img className="h-9 md:h-14" src={assets.chef_logo} alt="logo" />
                    <span className='text-lg md:text-2xl text-primary font-semibold'>Rizquna Bakery</span>
                </div>
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to={'/'}>Beranda</NavLink>
                <NavLink to={'/products'}>Semua Produk</NavLink>

                {/* Search Bar */}
                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Cari Produk" />
                    <img className='h-4 w-4' alt='search' src={assets.search_icon} />
                </div>

                {/* Cart Icon */}
                <div
                    className="relative cursor-pointer"
                    onClick={() => navigate('/cart')}

                >
                    <img className='w-6 opacity-80' alt='cart' src={assets.nav_cart_icon} />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                {
                    !user ? (
                        <button className="cursor-pointer px-6 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
                            onClick={() => {
                                setShowUserLogin(true)
                                setOpen(false)
                            }}
                        >
                            Login
                        </button>
                    ) : (
                        <div className='relative group'>
                            <img src={assets.profile_icon} alt='profile' className='w-10' />
                            <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow boorder border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
                                <li
                                    className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'
                                    onClick={() => navigate('/my-orders')}
                                >
                                        Orderan Saya
                                </li>
                                <li
                                    onClick={logout}
                                    className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'
                                >
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )
                }
            </div>

            <div className='flex items-center gap-6 sm:hidden'>
                <div
                    className="relative cursor ml-14"
                    onClick={() => navigate('/cart')}
                >
                    <img className='w-6 opacity-80' alt='cart' src={assets.nav_cart_icon} />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>
            </div>

            <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">
                {/* Menu Icon SVG */}
                <img alt='menu' src={assets.menu_icon} />
            </button>


            {/* Mobile Menu */}
            {
                open && (
                    <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-10`}>
                        <NavLink to={'/'} onClick={() => setOpen(false)}>Beranda</NavLink>
                        <NavLink to={'/products'} onClick={() => setOpen(false)}>Semua Produk</NavLink>

                        {user &&
                            <NavLink to={'/my-orders'} onClick={() => setOpen(false)}>Orderan Saya</NavLink>
                        }

                        {!user ? (
                            <button className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
                                onClick={() => {
                                    setOpen(false)
                                    setShowUserLogin(true)
                                }}
                            >
                                Login
                            </button>
                        ) : (
                            <button className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        )}
                    </div>
                )
            }
        </nav>
    )
}

export default Navbar