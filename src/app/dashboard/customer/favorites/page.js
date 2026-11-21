import { FavoritesTable } from "@/components/customer/FavoritesTable";

export const metadata = {
  title: "My Favorite Equipment",
  description:
    "Keep your preferred equipment close and find it whenever your next project needs it.",
};

export default function CustomerFavoritesPage() {
  return <FavoritesTable />;
}
