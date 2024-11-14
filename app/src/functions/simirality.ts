export const postSimilarity = async (assignment: string, words: string[]) => {
	// TODO クライアントサイドかサーバーサイドかでURLを変更する
	const response = await fetch("http://FastAPI:9004/similarity", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ assignmentWord: assignment, words: words }),
	});

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	// { "similarity": 0000] }
	const resData = await response.json();
	return resData;
};
