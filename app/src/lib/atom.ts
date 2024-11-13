import { atom } from "jotai";

export const statusChangeDialogOpenAtom = atom(false);

export const openStatusChangeDialogOpenAtom = atom(
	(get) => get(statusChangeDialogOpenAtom),
	(get, set) => set(statusChangeDialogOpenAtom, true),
);
