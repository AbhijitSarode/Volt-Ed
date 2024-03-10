// Import Components
import Button from "../../common/Button";
import HighlightText from "../../common/HighlightText";

// Import media
import video from "../../../assets/Images/banner.mp4";

const HeroSection = () => {
  return (
    <section className="mx-auto flex flex-col max-w-maxContent py-[25vh] h-screen justify-center">
      <div className="flex justify-center items-center flex-col">
        <h1 className="mt-7 text-center text-4xl font-semibold text-richblack-700">
          Supercharge your future with{" "}
          <HighlightText text={"Coding Skills"} gradient={"custom-gradient1"} />
        </h1>
        <p className="text-center text-lg w-[90%] font-bold text-richblack-700 mt-4">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </p>
        <div className="flex flex-row gap-7 mt-8">
          <Button active={true} linkto={"/signup"}>
            Learn More
          </Button>
          <Button active={false} linkto={"/login"}>
            Book a Demo
          </Button>
        </div>
      </div>

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-screen object-cover h-screen -z-10 opacity-70"
      >
        <source src={video} type="video/mp4" />
        Your browser does not support video playback
      </video>
    </section>
  );
};

export default HeroSection;
