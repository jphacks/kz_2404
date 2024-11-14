import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const pointDialogOpenAtom = atom<boolean>(false);

export const hasShownOnceAtom = atomWithStorage<boolean>("hasShownPointDialog", false);

export const usePointDialogOpen = () => useAtom(pointDialogOpenAtom);
export const useHasShownOnce = () => useAtom(hasShownOnceAtom);
