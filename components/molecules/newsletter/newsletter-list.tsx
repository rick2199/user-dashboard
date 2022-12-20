import axios from "axios";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import Link from "next/link";

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

  useEffect(() => {
    if (listsOwned && listsOwned.includes(listId)) {
      setListStatus(true);
    }
  }, [listId, listsOwned]);

  const handleClick = async () => {
    const { data } = await axios({
      method: "PUT",
      url: "/api/newsletter/lists",
      headers: { Authorization: `Bearer ${token}` },
      data: { listId, remove: listsOwned.includes(listId) },
    });
    if (data.data === "ok") {
      setListStatus(!hasListStatusChanged);
    }
  };

  const imageName = title.split(" ").join("-").toLowerCase();

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
          <Link href={`/category/${categoryWP}`}>
            <span className="cursor-pointer underline">See Lastest</span>
          </Link>
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
