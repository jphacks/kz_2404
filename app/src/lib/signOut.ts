export const signOut = () => {
	localStorage.removeItem("userID");
	window.location.href = "/login";
};
