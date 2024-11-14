import { atom, useAtom, useSetAtom } from "jotai";

export const statusChangeDialogAtom = atom<boolean>(false);

export const useStatusChangeDialog = () => useAtom(statusChangeDialogAtom);

export const useOpenStatusChangeDialog = () =>
	useSetAtom(statusChangeDialogAtom);

export const toggleStatusChangeDialog = () => {
	const [isOpen, setIsOpen] = useStatusChangeDialog();
	setIsOpen(!isOpen);
};
