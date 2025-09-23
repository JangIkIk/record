import { useEffect, useState } from "react";
import matter from "gray-matter";

type PostMeta = {
  title: string;
  date: string;
  tags: string[];
  slug: string;
  contentPreview: string;
};

function Posts() {
  const [postList, setPostList] = useState<PostMeta[]>([]);

  useEffect(() => {
    const PostsMd = import.meta.glob("/src/entities/posts/md/*/*.md", {
      eager: true,
      as: "raw",
    });

    const posts = Object.entries(PostsMd).map(([_, fileContent]) => {
      const { data, content } = matter(fileContent as string);

      const contentPreview = content.trim().slice(0, 100) + "...";

      return {
        ...(data as Omit<PostMeta, "contentPreview">),
        contentPreview,
      };

    });

    setPostList([...posts])
  }, []);

  return (
    <ul>
      {postList.map((item, idx) => (
        <li key={idx} className="hover:ct-bg-2 rounded-md p-2 cursor-pointer mb-2">
          <h3 className="text-clamp-base ct-text-1">
            {item.title}
          </h3>
          <p className="text-clamp-sm ct-text-2 py-2">
            {item.contentPreview}
          </p>
          <div className="flex justify-between">
            <div className="flex gap-3">
                {item.tags.map((tag) => <span key={tag} className="text-clamp-xs">{tag}</span>)}
            </div>
            <span className="text-clamp-xs">{item.date}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Posts;
