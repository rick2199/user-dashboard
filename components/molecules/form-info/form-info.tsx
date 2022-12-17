import Image from "next/image";

const FormInfo = () => {
  return (
    <div className="my-6 flex flex-row items-start gap-3 text-left text-text-light bg-[#FEFCEC] p-4">
      <Image
        src="/icons/info-icon.svg"
        height={24}
        width={24}
        className="flex-none"
        alt="thedefiant-help"
      />
      <span className="text-sm">
        Still not working? Maybe it’s something we did. Reach out to us on our{" "}
        <a
          href="https://discord.com/invite/thedefiant"
          target="__blank"
          className="underline"
        >
          Discord
        </a>{" "}
        for more help.
      </span>
    </div>
  );
};

export default FormInfo;
