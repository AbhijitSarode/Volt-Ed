// Import dependencies
import { TypeAnimation } from "react-type-animation";

const Code = ({ codeColor, codeBlock, backgroundGradient }) => {
  return (
    <code className="flex flex-row w-2/4">
      {/* Background Gradient */}
      <div className={`rounded-full h-3/5 w-[95%] ${backgroundGradient}`}></div>

      <div className="border border-white/10 flex w-screen -translate-x-[20%] backdrop-blur-md">
        <div className="text-center font-inter text-richblack-400 font-bold w-[10%]">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
          <p>12</p>
          <p>13</p>
          <p>14</p>
        </div>
        <div className={`text-blue-5 font-bold w-11/12 ${codeColor}`}>
          <TypeAnimation
            sequence={[codeBlock, 2000, ""]}
            repeat={Infinity}
            style={{ whiteSpace: "pre-line", display: "block" }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </code>
  );
};

export default Code;
