import { FavoritesTable } from "@/components/customer/FavoritesTable";

export const metadata = {
  title: "My Favorites",
  description:
    "Your saved equipment, availability status, and quick booking links in one place.",
};

export default function CustomerFavoritesPage() {
  return <FavoritesTable />;
}
