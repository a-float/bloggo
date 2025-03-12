import { Blog } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

export default function BlogCard(props: Blog) {
  return (
    <Link href={`/blogs/${props.slug}`}>
      <div className="card h-full bg-base-100 shadow-lg">
        <figure>
          <Image
            className="w-full object-cover"
            width={600}
            height={300}
            src={`https://picsum.photos/seed/${props.title}/600/300`}
            alt=""
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {props.title}
            <div className="badge badge-secondary">NEW</div>
          </h2>
          <p>{props.summary}</p>
          <div className="card-actions justify-end">
            <div className="badge badge-outline">Fashion</div>
            <div className="badge badge-outline">Products</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
