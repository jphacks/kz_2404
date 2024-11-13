import { atom } from "jotai";

export const dialogOpenAtom = atom(false);

export const openDialogAtom = atom(
	(get) => get(dialogOpenAtom),
	(get, set) => set(dialogOpenAtom, true),
);
