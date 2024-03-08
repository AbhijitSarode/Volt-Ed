// Import dependencies
import { useState } from "react";

// Import Files
import { HomePageExploreData } from "../../../data/homepage-explore";

// Import Components
import HighlightText from "../../common/HighlightText";
import CourseCard from "./CourseCard";
import Button from "../../common/Button";
import { FaArrowRight } from "react-icons/fa";

const tabsName = [
  "Free",
  "New to Coding",
  "Most Popular",
  "Skills Paths",
  "Career Paths",
];

/**
 * This component represents the Explore More section of the home page.
 * This component displays the courses in the form of cards.
 * This component uses course card data from `HomePageExploreData` and displays the courses based on the tab selected.
 * This compoenent is used in the `Home` page.
 */
const ExploreMoreSection = () => {
  // State to manage the current tab and courses
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExploreData[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExploreData[0].courses[0].heading
  );

  // Function to set the current tab and courses
  const setMyCards = (tabName) => {
    setCurrentTab(tabName);

    const newCourses = HomePageExploreData.filter(
      (course) => course.tag === tabName
    );

    setCourses(newCourses[0].courses);
    setCurrentCard(newCourses[0].courses[0].heading);
  };

  return (
    <div>
      <div>
        <div className="text-4xl font-semibold text-center my-10">
          Unlock the{" "}
          <HighlightText text={"Power of Code"} gradient={"custom-gradient1"} />
          <p className="text-center text-richblack-400 text-lg font-semibold mt-4">
            Learn to Build Anything You Can Imagine
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-5 -mt-5 mx-auto w-max bg-grey-25 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]">
        {tabsName.map((element, index) => (
          <div
            key={index}
            onClick={() => setMyCards(element)}
            className={` text-[16px] flex flex-row items-center gap-2
              ${
                currentTab === element
                  ? "bg-congressblue-900 text-richblack-5 font-medium"
                  : "text-congressblue-800"
              } px-7 py-[7px] rounded-full transition-all duration-200 cursor-pointer hover:bg-congressblue-800 hover:text-white`}
          >
            {element}
          </div>
        ))}
      </div>

      {/* Courses card */}
      <div className="gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
        {courses.map((course, index) => (
          <CourseCard
            key={index}
            cardData={course}
            currentCard={currentCard}
            setCurrentCard={setCurrentCard}
          />
        ))}
      </div>

      {/* Explore Catalogue section */}
      <div className="homepage_bg h-[320px]">
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
          <div className="lg:h-[150px]"></div>
          <div className="flex flex-row gap-7 text-white lg:mt-8">
            <Button active={true} linkto={"/catalogue"}>
              <div className="flex items-center gap-2">
                Explore Full Catalogue
                <FaArrowRight />
              </div>
            </Button>
            <Button active={false} linkto={"/signup"}>
              {" "}
              Learn More{" "}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreMoreSection;
