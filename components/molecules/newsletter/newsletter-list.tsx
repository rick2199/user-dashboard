import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import Link from "next/link";
import { UserContext } from "@/context/user-context";

interface NewsletterListProps {
  title: string;
  frequency: string;
  listsOwned: string[];
  token: string;
  listId: string;
  categoryWP: string;
}

const NewsletterList: React.FC<NewsletterListProps> = ({
  title,
  frequency,
  listsOwned,
  token,
  listId,
  categoryWP,
}) => {
  const [hasListStatusChanged, setListStatus] = useState<boolean>(false);
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (listsOwned && listsOwned.includes(listId)) {
      setListStatus(true);
    }
  }, [listId, listsOwned]);

  const handleClick = async () => {
    if (user?.role === "FREE") {
      if (typeof window !== "undefined") {
        window.open(
          `${process.env.NEXT_PUBLIC_BLOG_URL_URL}/go-premium`,
          "_blank"
        );
        return;
      }
    }
    try {
      const { data } = await axios({
        method: "PUT",
        url: "/api/auth/lists",
        headers: { Authorization: `Bearer ${token}` },
        data: { listId, remove: listsOwned.includes(listId) },
      });
      if (data.data === "ok") {
        setListStatus(!hasListStatusChanged);
      }
    } catch (err) {
      console.log({ err });
    }
  };

  const imageName = categoryWP.toLowerCase();

  return (
    <div className="relative mt-12 flex gap-4">
      <Image
        src={`/thumbnails/${imageName}.png`}
        alt={imageName}
        height={48}
        width={72}
      />

      <div>
        <Heading size="xs">{title}</Heading>
        <Text className="text-sm md:text-base">
          {frequency} |{" "}
          <a
            target="_blank"
            href={`${process.env.NEXT_PUBLIC_BLOG_URL_URL}/newsletter`}
            rel="noreferrer"
          >
            <span className="cursor-pointer underline">See Lastest</span>
          </a>
        </Text>
      </div>
      {listsOwned ? (
        !hasListStatusChanged ? (
          <button
            className="absolute right-0 border-2 border-dark-black px-4 py-3"
            onClick={handleClick}
          >
            <Heading size="xs">Add</Heading>
          </button>
        ) : (
          <button
            className="absolute right-0 px-4 py-3 underline"
            onClick={handleClick}
          >
            <Heading size="xs">Remove</Heading>
          </button>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default NewsletterList;
