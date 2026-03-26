import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const ContactInfoItems = [
  {
    id: 1,
    icon: <FaMapMarkerAlt />,
    title: 'Find Us',
    subtitle: 'Street # 123, abcroad,city',
  },
  {
    id: 2,
    icon: <FaPhoneAlt />,
    title: 'Call Us',
    subtitle: '+923000000000',
  },
  {
    id: 3,
    icon: <FaEnvelope />,
    title: 'Mail Us',
    subtitle: 'abc@info.com',
  },
];

const ContactInfo = () => {
  return (
    <div className="w-full bg-gray-300 py-8 md:py-16 px-2 md:px-4">
      <div className="max-w-[1920px] mx-auto grid grid-cols-3 gap-2 md:gap-8 divide-x divide-gray-400/0 md:divide-none">
        {ContactInfoItems.map((item) => (
          <div key={item.id} className="flex flex-row items-center justify-center gap-2 md:gap-6 text-left">
            {/* Icon */}
            <div className="text-cyan-400 text-2xl md:text-6xl shrink-0">
              {item.icon}
            </div>

            {/* Text */}
            <div className="flex flex-col min-w-0">
              <h3 className="text-xs md:text-2xl font-bold text-black truncate">{item.title}</h3>
              <p className="text-gray-700 text-[9px] md:text-base font-medium leading-tight line-clamp-2">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactInfo;
