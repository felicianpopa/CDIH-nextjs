import Link from "next/link";

export default function NotFound() {
  return (
    <article style={{ padding: "100px" }}>
      <h1>Oops!</h1>
      <p>Page Not Found</p>
      <div className="flexGrow">
        <Link href="/">Visit Our Homepage</Link>
      </div>
    </article>
  );
}
