/**
 * @Component Renders text with a specified gradient.
 * @param {string} text - The text to be highlighted.
 * @param {string} gradient - The CSS class name for the gradient effect.
 */
const HighlightText = ({ text, gradient }) => {
  return <span className={`font-bold ${gradient}`}>{text}</span>;
};

export default HighlightText;
