// Import Components
import HighlightText from "../../common/HighlightText";
import Timeline from "./Timeline";

/**
 * Showcases the timeline section which consists of a heading and a `Timeline` component.
 * This component is used in the `Home` page.
 */
const TimelineSection = () => {
  return (
    <div className=" text-richblack-700">
      <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">
        <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-10 lg:mt-20 lg:flex-row lg:gap-0">
          <h2 className="text-4xl font-semibold lg:w-[45%] ">
            Get the skills you need for a
            <HighlightText
              text={" job that is in demand."}
              gradient={"custom-gradient2"}
            />
          </h2>
          <div className="flex flex-col items-start gap-10 lg:w-[40%]">
            <p className="text-[16px]">
              The modern Volt-Ed dictates its own terms. Today, to be a
              competitive specialist requires more than professional skills.
            </p>
          </div>
        </div>
      </div>

      <Timeline />
    </div>
  );
};

export default TimelineSection;
