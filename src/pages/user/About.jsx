import React from 'react';
import Footer from '../../components/layout/Footer/Footer';
import AboutHero from '../../components/About/AboutHero';
import Mission from '../../components/About/Mission';
import CoreValues from '../../components/About/CoreValues';
import BrandPromise from '../../components/About/BrandPromise';

const About = () => {
    return (
        <div className='w-full overflow-x-hidden'>
            <AboutHero />
            <Mission />
            <CoreValues />
            <BrandPromise />
            <Footer />
        </div>
    );
};

export default About;
