import Link from "next/link";
import { formatDate } from "~utils/formatters";

type PostProps = {
  post: {
    [string: string]: any;
  };
};

export function Post(props: PostProps) {
  const { post } = props;
  return (
    <div className="my-2 mx-0 p-3 border" key={post.id}>
      {post.body}
      <br />
      <small className="text-muted">
        by <Link href={`/profile/${post.user.id}`}>{post.user.username}</Link> on {formatDate(post.created_at)}
      </small>
    </div>
  );
}
