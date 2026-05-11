import Hero from './home/Hero';
import ServicesStrip from './home/ServicesStrip';
import FeaturedTreatments from './home/FeaturedTreatments';
import FeaturedProducts from './home/FeaturedProducts';

export default function Home({ go }) {
  return (
    <>
      <Hero go={go} />
      <ServicesStrip />
      <FeaturedTreatments onView={() => go('treatments')} onBook={() => go('book')} />
      <FeaturedProducts go={go} />
    </>
  );
}