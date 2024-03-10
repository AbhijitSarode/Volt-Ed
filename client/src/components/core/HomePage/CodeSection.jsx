// Import Components
import CodeBlock from "./CodeBlock";
import HighlightText from "../../common/HighlightText";

/**
 * Showcases animated code snippets which consists of two `CodeBlock` components displaying course information and code snippets.
 * This compoenent is used in the `Home` page.
 */
const CodeSection = () => {
  return (
    <section className="h-full bg-richblack-800 flex flex-col">
      <CodeBlock
        position={"md:flex-row"}
        heading={
          <h2 className="text-4xl font-semibold">
            Unlock your{" "}
            <HighlightText
              text={"coding potential"}
              gradient={"custom-gradient1"}
            />{" "}
            with our online courses.
          </h2>
        }
        subHeading={
          "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
        }
        ctaBtn1={{
          active: true,
          linkto: "/signup",
          text: "Try it Yourself",
        }}
        ctaBtn2={{
          active: false,
          linkto: "/login",
          text: "Learn More",
        }}
        codeBlock={`<!DOCTYPE html>\n<head>\n<title> Volt-Ed </title>\n</head>\n<body>\n<nav>\n<ul>\n<li> Home </li>\n<li> About Us </li>\n<li> Contact Us </li>\n</ul>\n</nav>\n</body>\n</html>`}
        backgroundGradient={"code-gradient1"}
      />

      <CodeBlock
        position={"m:flex-row"}
        heading={
          <h2 className="text-4xl font-semibold">
            Start{" "}
            <HighlightText
              text={"coding in seconds"}
              gradient={"custom-gradient1"}
            />
          </h2>
        }
        subHeading={
          "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
        }
        ctaBtn1={{
          active: true,
          linkto: "/signup",
          text: "Continue Lesson",
        }}
        ctaBtn2={{
          active: false,
          linkto: "/login",
          text: "Learn More",
        }}
        codeBlock={`int search(vector<int>& arr, int target, int left, int right) {\nif (left <= right) {\nint mid = left + (right - left) / 2;\nif (arr[mid] == target) {\nreturn mid;\n}\nif (arr[mid] < target) {\nreturn search(arr, target, mid + 1, right);\n} else {\nreturn search(arr, target, left, mid - 1);\n}\n}\nreturn -1;}`}
        backgroundGradient={"code-gradient2"}
      />
    </section>
  );
};

export default CodeSection;
