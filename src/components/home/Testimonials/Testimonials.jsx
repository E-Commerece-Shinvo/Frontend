import React from 'react';
import { FaStar } from 'react-icons/fa';
import userAvatar from '../../../assets/user_avatar.png';

const reviews = [
    {
        id: 1,
        number: 1,
        quote: '"I\'m always skeptical of buying accessories online, but I\'m so impressed. My Anker charger and Baseus power bank are 100% genuine. Will be back for more."',
        name: 'John Doe',
        title: 'Tech Enthusiast',
    },
    {
        id: 2,
        number: 2,
        quote: '"I\'m always skeptical of buying accessories online, but I\'m so impressed. My Anker charger and Baseus power bank are 100% genuine. Will be back for more."',
        name: 'John Doe',
        title: 'Tech Enthusiast',
    },
    {
        id: 3,
        number: 3,
        quote: '"I\'m always skeptical of buying accessories online, but I\'m so impressed. My Anker charger and Baseus power bank are 100% genuine. Will be back for more."',
        name: 'John Doe',
        title: 'Tech Enthusiast',
    },
    {
        id: 4,
        number: 4,
        quote: '"The product quality is amazing! I was worried about compatibility, but everything works perfectly with my setup. Highly recommend!"',
        name: 'Sarah Smith',
        title: 'Verified Buyer',
    },
    {
        id: 5,
        number: 5,
        quote: '"Fast shipping and great customer support. Had a small question and they answered immediately. The charger is super fast!"',
        name: 'Mike Johnson',
        title: 'Gadget Lover',
    },
    {
        id: 6,
        number: 6,
        quote: '"Best purchase I\'ve made this year. The build quality is solid and it feels very premium. Definitely worth the price."',
        name: 'Emily Davis',
        title: 'Designer',
    },
];

const Testimonials = () => {
    return (
        <div className="w-full py-10 flex flex-col items-center bg-white">
            {/* Header */}
            <span className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-4">Testimonals</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-20 text-center">
                What Our <span className="text-cyan-400">Customers</span> Say
            </h2>

            {/* Reviews Grid */}
            <div className="flex overflow-x-auto gap-8 w-full max-w-[1920px] px-4 pb-8 pt-10 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {reviews.map((review) => (
                    <div key={review.id} className="flex flex-col items-center min-w-[85vw] sm:min-w-[400px] snap-center">
                        {/* Card */}
                        <div className="relative bg-gray-100 rounded-[40px] p-8 pt-12 pb-16 flex flex-col items-center text-center shadow-sm w-full">
                            {/* Number Badge */}
                            <div className="absolute -top-6 w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md border-4 border-white z-10">
                                {review.number}
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 text-yellow-400 mb-6 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} size={20} />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-gray-700 leading-relaxed font-medium">
                                {review.quote}
                            </p>
                        </div>

                        {/* User Profile - Overlapping the card */}
                        <div className="-mt-10 flex flex-col items-center z-10">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                                <img src={userAvatar} alt={review.name} className="w-full h-full object-cover" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mt-2">{review.name}</h4>
                            <p className="text-gray-500 text-sm font-medium">{review.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;
