import { Link } from "react-router-dom";
/**
 * @component Renders a button. Red when active, blue when inactive.
 * @param {ReactNode} children - The content of the button.
 * @param {boolean} active - Determines if the button is active.
 * @param {string} linkto - The link to navigate when the button is clicked.
 */
const Button = ({ children, active, linkto }) => {
  return (
    <Link
      to={linkto}
      className={`text-center text-[13px] px-6 py-3 rounded-md font-bold text-white ${
        active
          ? "bg-amaranth-500 shadow-[#B12543_0px_-3px_0px_0px_inset]"
          : "bg-congressblue-800 shadow-[0px_-3px_0px_0px_#11345A_inset]"
      } hover:scale-95 transition-all duration-200`}
    >
      {children}
    </Link>
  );
};

export default Button;
