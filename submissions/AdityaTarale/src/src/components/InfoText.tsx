import { type FC } from "react";

type InfoTextProps = {
  type?: "default" | "error";
  title: string;
};

const InfoText: FC<InfoTextProps> = ({ title, type = "default" }) => {
  return (
    <div
      className={`flex flex-1 items-center justify-center text-sm text-${type === "default" ? "gray" : "red"}-500 sm:text-lg`}
    >
      {title}
    </div>
  );
};

export default InfoText;
