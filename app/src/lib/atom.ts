import { atom, useAtom, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const statusChangeDialogAtom = atom<boolean>(false);

export const useStatusChangeDialog = () => useAtom(statusChangeDialogAtom);

export const useOpenStatusChangeDialog = () =>
	useSetAtom(statusChangeDialogAtom);

export const toggleStatusChangeDialog = () => {
	const [isOpen, setIsOpen] = useStatusChangeDialog();
	setIsOpen(!isOpen);
};

export const pointDialogOpenAtom = atom<boolean>(false);

export const hasShownOnceAtom = atomWithStorage<boolean>(
	"hasShownPointDialog",
	false,
);

export const usePointDialogOpen = () => useAtom(pointDialogOpenAtom);
export const useHasShownOnce = () => useAtom(hasShownOnceAtom);
