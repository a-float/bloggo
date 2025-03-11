import { Blog } from "@prisma/client";

const BlogCard = (props: Blog) => (
  <div className="card bg-base-100 shadow-sm">
    <figure>
      <img
        width={400}
        height={200}
        src={`https://picsum.photos/seed/${props.id}/400/200`}
        alt=""
      />
    </figure>
    <div className="card-body">
      <h2 className="card-title">
        {props.title}
        <div className="badge badge-secondary">NEW</div>
      </h2>
      <p>{props.content}</p>
      <div className="card-actions justify-end">
        <div className="badge badge-outline">Fashion</div>
        <div className="badge badge-outline">Products</div>
      </div>
    </div>
  </div>
);

export default BlogCard;
