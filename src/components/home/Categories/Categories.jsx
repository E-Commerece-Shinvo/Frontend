import { FaArrowRight } from "react-icons/fa6";
import img1 from "../../../assets/categoery/1.jpg";
import img2 from "../../../assets/categoery/2.jpg";
import img3 from "../../../assets/categoery/3.jpg";
import img4 from "../../../assets/categoery/4.jpg";

const Categories = () => {
    const categories = [
        { id: 1, title: "Smart Watch", image: img1 },
        { id: 2, title: "Power Bank", image: img2 },
        { id: 3, title: "Charger", image: img3 },
        { id: 4, title: "Earbuds", image: img4 },
    ];

    return (
        <div className="w-full bg-white py-10">
            <div className="max-w-[1920px] mx-auto px-6 flex flex-col items-center gap-10">

                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-0 sm:mb-10">
                        Find Accessories<br />For Your Device
                    </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    {categories.map((cat) => (
                        <div key={cat.id} className="relative h-[100%] w-[100%] sm:h-[80%] sm:w-[98%] aspect-square rounded-[30px] sm:rounded-[60px] md:rounded-[90px] lg:rounded-[60px] 2xl:rounded-[100px] overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 shadow-lg shadow-black">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${cat.image})` }}
                            ></div>

                            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black to-transparent"></div>

                            <div className="absolute bottom-6 left-0 w-full text-center z-10">
                                <h3 className="text-white text-[16px] sm:text-xl md:text-2xl font-bold tracking-wide">{cat.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="flex btn-primary items-center gap-3 text-black px-3 py-2 sm:px-8 sm:py-3 lg:px-6 lg:py-5 lg:text-lg rounded-full font-bold transition-colors shadow-lg hover:shadow-cyan-400/50">
                    View All Products
                    {/* <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
                        <FaArrowRight className="w-[30px] h-[30px] text-black text-xs -rotate-45" />
                    </div> */}
                </button>

            </div>
        </div>
    );
};

export default Categories;
