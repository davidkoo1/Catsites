import { Console } from "console";
import { Container } from "postcss";
import Listings from "./auctions/Listings";
import { getCurrentUser } from "./actions/authActions";

export default async function Home() {
  const user = await getCurrentUser();
  return (
    <div>
      <Listings user={user} />
    </div>

  );
}
