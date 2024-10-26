from fastapi import FastAPI
from pydantic import BaseModel
import nltk
from nltk.corpus import wordnet as wn
from typing import List

nltk.download('wordnet')
nltk.download('omw-1.4')  # WordNetに関連する語彙のデータセットもダウンロード

app = FastAPI()


# 単語の意味を取得
apple = wn.synset('apple.n.01')  # 名詞 "apple" の代表的な意味
orange = wn.synset('orange.n.01')  # 名詞 "orange" の代表的な意味

@app.get("/")
async def root():
    similarity = apple.wup_similarity(orange)
    print(f"Similarity: {similarity}")
    return {"message": "Hello World"}


class Words(BaseModel):
    asignmentWord: str
    words: List[str]

@app.post("/similarity")
async def similarity(reqWords: Words):
    asignmentWord = reqWords.asignmentWord
    words = reqWords.words

    asignmentWord_synset = wn.synset(f"{asignmentWord}.n.01")

    highscore = 0
    for word in words:
        word_synset = wn.synset(f"{word}.n.01")
        similarity = asignmentWord_synset.wup_similarity(word_synset)
        if similarity is None:
            return {"error": f"'{asignmentWord}' と '{word}' の類似度を計算できません。"}

        print(f"{word}: {similarity}")

        if similarity > highscore:
            highscore = similarity
    
    return {"similarity": highscore}

# MEMO こんな感じでPOSTリクエストを送る
#  curl -X POST "http://localhost:9004/similarity" \
# -H "Content-Type: application/json" \
# -d '{"asignmentWord": "dog", "words": ["apple", "banana", "cherry"]}'
