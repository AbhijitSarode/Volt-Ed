// Import Components
import HeroSection from "../components/core/HomePage/HeroSection";
import CodeSection from "../components/core/HomePage/CodeSection";
import ExploreMoreSection from "../components/core/HomePage/ExploreMoreSection";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import Footer from "../components/common/Footer";

const Home = () => {
  return (
    <>
      <HeroSection />
      <CodeSection />
      <ExploreMoreSection />
      <TimelineSection />
      <LearningLanguageSection />
      <InstructorSection />
      <Footer />
    </>
  );
};

export default Home;
