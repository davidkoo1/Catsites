import { Console } from "console";
import { Container } from "postcss";
import Listings from "./auctions/Listings";
import { getCurrentUser } from "./actions/authActions";
import { User } from "next-auth";

export default async function Home() {
  const user = await getCurrentUser() as User;
  return (
    <div>
      <Listings user={user} />
    </div>

  );
}
