import { atom, useAtom, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const statusChangeDialogAtom = atom<boolean>(false);

export const useStatusChangeDialog = () => useAtom(statusChangeDialogAtom);

export const useOpenStatusChangeDialog = () =>
	useSetAtom(statusChangeDialogAtom);

export const hasShownOnceAtom = atomWithStorage<boolean>(
	"hasShownPointDialog",
	false,
);
export const useHasShownOnce = () => useAtom(hasShownOnceAtom);

export const pointDialogOpenAtom = atom<boolean>(false);

export const usePointDialog = () => useAtom(pointDialogOpenAtom);

export const useOpenPointDialog = () => {
	const setPointDialog = useSetAtom(pointDialogOpenAtom);
	return () => setPointDialog(true);
};

export const useClosePointDialog = () => {
	const setPointDialog = useSetAtom(pointDialogOpenAtom);
	return () => setPointDialog(false);
};
