// Import Components
import Button from "../../common/Button";
import HighlightText from "../../common/HighlightText";

// Import Icons

// Import Images
import Instructor from "../../../assets/Images/Instructor.png";

/**
 * Showcasing the Instructor and encouraging them to join the platform
 */
const InstructorSection = () => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-20 items-center">
        <div className="lg:w-[50%]">
          <img src={Instructor} alt="" />
        </div>
        <div className="lg:w-[50%] flex gap-10 flex-col">
          <h1 className="lg:w-[50%] text-4xl font-semibold ">
            Become an
            <HighlightText text={" instructor"} gradient={"custom-gradient2"} />
          </h1>

          <p className="font-medium text-[16px] text-justify w-[90%] text-richblack-300">
            Instructors from around the world teach millions of students on
            Volt-Ed. We provide the tools and skills to teach what you love.
          </p>

          <div>
            <Button active={true} linkto={"/signup"}>
              Start Teaching Today
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
