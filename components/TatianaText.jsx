import { TatianaLink } from "./TatianaLink";

export function TatianaText({ text }) {
  const parts = String(text).split(/(TatianaSF|TatianSF)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part === "TatianaSF" || part === "TatianSF") {
          return <TatianaLink key={`${part}-${index}`} />;
        }

        return part;
      })}
    </>
  );
}
