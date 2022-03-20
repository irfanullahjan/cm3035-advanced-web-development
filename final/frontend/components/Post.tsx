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
        by {post.username} on {formatDate(post.created_at)}
      </small>
    </div>
  );
}
