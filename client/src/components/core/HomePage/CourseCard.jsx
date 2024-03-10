// Import Dependencies
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

/**
 * This component represents a course card. This component takes cardData, currentCard, and setCurrentCard as props.
 * If the card is clicked, it will set the background color to white, else set it to blue.
 * This component is used in the `ExploreMoreSection` component.
 */
const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  return (
    <div
      className={`w-[360px] lg:w-[30%] ${
        currentCard === cardData?.heading
          ? "bg-white shadow-[12px_12px_0_0_#B12543]"
          : "bg-blue-900"
      }
    text-richblack-5 box-border cursor-pointer`}
      onClick={() => setCurrentCard(cardData?.heading)}
    >
      <div className="border-b-[2px] border-richblack-400 border-dashed h-[80%] p-6 flex flex-col gap-3">
        <div
          className={` ${
            currentCard === cardData?.heading && "text-richblack-800"
          } font-semibold text-[20px]`}
        >
          {cardData?.heading}
        </div>

        <div className="text-richblack-400">{cardData?.description}</div>
      </div>

      <div
        className={`flex justify-between ${
          currentCard === cardData?.heading
            ? "text-blue-300"
            : "text-richblack-300"
        } px-6 py-3 font-medium`}
      >
        <div className="flex items-center gap-2 text-[16px]">
          <HiUsers />
          <p>{cardData?.level}</p>
        </div>

        {/* Flow Chart */}
        <div className="flex items-center gap-2 text-[16px]">
          <ImTree />
          <p>{cardData?.lessonNumber} Lesson</p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
