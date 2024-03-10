// Import dependencies
import { BsArrowRight } from "react-icons/bs";

// Import Components
import Button from "../../common/Button";
import Code from "./Code";

/**
 * This component represents an each code block on the `Home` page.
 * This component takes heading, subHeading, buttons, codeBlock(and its props).
 * This component is used in the `CodeSection` component.
 */
const CodeBlock = ({
  position,
  heading,
  subHeading,
  ctaBtn1,
  ctaBtn2,
  codeBlock,
  backgroundGradient,
  codeColor,
}) => {
  return (
    <div
      className={`flex ${position} my-20 justify-between gap-10 w-10/12 mx-auto flex-row-reverse`}
    >
      <div className="flex flex-col gap-8 w-2/4 text-white">
        {heading}
        <p className="text-richblack-300">{subHeading}</p>

        <div className="flex gap-7 mt-7">
          <Button active={ctaBtn1.active} linkto={ctaBtn1.linkto}>
            <div className="flex gap-2 items-center">
              {ctaBtn1.text}
              <BsArrowRight />
            </div>
          </Button>

          <Button active={ctaBtn2.active} linkto={ctaBtn2.linkto}>
            {ctaBtn2.text}
          </Button>
        </div>
      </div>
      <Code
        codeColor={codeColor}
        codeBlock={codeBlock}
        backgroundGradient={backgroundGradient}
      />
    </div>
  );
};

export default CodeBlock;
