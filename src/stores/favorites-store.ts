import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FavoriteItem {
  id: string;
  title: string;
  slug: string;
  authorName?: string;
  categoryName?: string;
  thumbnailUrl?: string;
  audioUrl?: string | null;
  duration?: number | null;
  type?: string;
  savedAt: string;
}

export interface FavoritesState {
  favorites: FavoriteItem[];
  isHydrated: boolean;
}

export interface FavoritesActions {
  addFavorite: (item: Omit<FavoriteItem, "savedAt">) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (item: Omit<FavoriteItem, "savedAt">) => boolean;
  clearFavorites: () => void;
  setHydrated: (val: boolean) => void;
}

export type FavoritesStore = FavoritesState & FavoritesActions;

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      isHydrated: false,

      setHydrated: (isHydrated: boolean) => set({ isHydrated }),

      addFavorite: (item) => {
        const { favorites } = get();
        if (favorites.some((f) => f.id === item.id)) return;
        set({
          favorites: [
            {
              ...item,
              savedAt: new Date().toISOString(),
            },
            ...favorites,
          ],
        });
      },

      removeFavorite: (id: string) => {
        set({
          favorites: get().favorites.filter((f) => f.id !== id),
        });
      },

      toggleFavorite: (item) => {
        const { favorites } = get();
        const exists = favorites.some((f) => f.id === item.id);
        if (exists) {
          set({
            favorites: favorites.filter((f) => f.id !== item.id),
          });
          return false;
        } else {
          set({
            favorites: [
              {
                ...item,
                savedAt: new Date().toISOString(),
              },
              ...favorites,
            ],
          });
          return true;
        }
      },

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "phat-phap-favorites-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// Atomic selector hooks
export const useFavoritesList = () =>
  useFavoritesStore((state) => (state.isHydrated ? state.favorites : []));

export const useFavoritesCount = () =>
  useFavoritesStore((state) => (state.isHydrated ? state.favorites.length : 0));

export const useIsFavorite = (id?: string) =>
  useFavoritesStore((state) =>
    state.isHydrated && id ? state.favorites.some((f) => f.id === id) : false
  );
