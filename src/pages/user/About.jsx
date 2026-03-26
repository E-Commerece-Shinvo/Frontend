import React from 'react';
import Footer from '../../components/layout/Footer/Footer';
import AboutHero from '../../components/about/AboutHero';
import Mission from '../../components/about/Mission';
import CoreValues from '../../components/about/CoreValues';
import BrandPromise from '../../components/about/BrandPromise';

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
