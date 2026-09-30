import { useSmoothScroll } from './lib/useSmoothScroll';
import { IntroProvider } from './lib/intro';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Hero from './components/Hero';
import Goals from './components/Goals';
import FeaturedTreatment from './components/FeaturedTreatment';
import FeaturedTreatmentV2 from './components/FeaturedTreatmentV2';
import HowItWorks from './components/HowItWorks';
import ApproachGrid from './components/approach/ApproachGrid';
import ApproachStack from './components/approach/ApproachStack';
import PointOfView from './components/PointOfView';
import Founder from './components/Founder';
import Journal from './components/Journal';
import Faq from './components/Faq';
import JoinMovement from './components/JoinMovement';
import Footer from './components/Footer';

export default function App() {
  useSmoothScroll();

  return (
    <IntroProvider>
      <Preloader />
      <Header />
      <main>
        <div id="top" />
        <Hero />
        <Goals />
        <FeaturedTreatment />
        <FeaturedTreatmentV2 id="featured-v2" background="image" />
        <FeaturedTreatmentV2 id="featured-v3" background="brand" />
        {/* fadeFrom = bottom colour of the section above each version */}
        <HowItWorks version="v1" fadeFrom="#253990" />
        <HowItWorks version="v2" fadeFrom="#0B0908" />
        <ApproachGrid />
        <ApproachStack id="approach-v2" layout="split" label="Approach V2" />
        <ApproachStack id="approach-v3" layout="column" label="Approach V3" />
        <PointOfView />
        <Founder />
        <Journal />
        <Faq />
        <JoinMovement />
      </main>
      <Footer />
    </IntroProvider>
  );
}
