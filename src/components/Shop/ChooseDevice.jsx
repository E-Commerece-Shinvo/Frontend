import { useNavigate } from 'react-router-dom';

const defaultBrands = [
    "Samsung",
    "Vivo",
    "Xiaomi",
    "iPhone",
    "Google Pixel"
];

const ChooseDevice = ({ items = [] }) => {
    const navigate = useNavigate();
    const displayItems = items.length > 0 ? items : defaultBrands.map(b => ({ name: b, _id: b }));

    const handleButtonClick = (e, item) => {
        // Find the element with category ID on the same page
        const element = document.getElementById(item._id);
        
        if (element) {
            e.preventDefault();
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (item._id !== item.name) {
            // Only navigate if it's not a generic placeholder
            navigate(`/category/${item._id}`);
        }
    };

    return (
        <div className="w-full max-w-[1820px] mx-auto py-12 px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-black uppercase tracking-tight">
                Choose Your Category
            </h2>

            <div className="w-full flex flex-wrap justify-center gap-6">
                {displayItems.map((item) => (
                    <button
                        key={item._id || item.name}
                        onClick={(e) => handleButtonClick(e, item)}
                        className="px-8 py-4 flex-1 min-w-[200px] max-w-[300px] bg-white border border-gray-100 rounded-2xl shadow-md transition-all duration-300 text-lg font-bold text-gray-800 hover:shadow-[0_0px_2px_2px_rgba(34,211,238,0.5)] hover:scale-105 text-center uppercase tracking-widest cursor-pointer active:scale-95"
                    >
                        {item.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChooseDevice;
