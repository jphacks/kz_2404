// キャプション英文の分割

export const shapeCaption = (caption: string) => {
	// todo キャプション生成したくないためサンプルで定義している。統合の際には削除する
	caption = "A small band performing in a living room setting.";

	const stopWords = new Set(["a", "is", "the", "in", "and", "of", "to", "for", "on"]);

	// wordの整形,英単語の抽出と不要な単語の削除
	const splitWords = caption.toLowerCase().split(" ");
	const filterWords = splitWords.filter((word) => !stopWords.has(word));

	// note 現在返るのはこれ　["small", "band", "performing", "living", "room", "setting"]
	return filterWords;
};