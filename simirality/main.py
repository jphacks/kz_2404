from typing import List

import nltk
from fastapi import FastAPI
from nltk.corpus import wordnet as wn
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

nltk.download("wordnet")
nltk.download("omw-1.4")  # WordNetに関連する語彙のデータセットもダウンロード

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,  # 追記により追加
    allow_methods=["*"],  # 追記により追加
    allow_headers=["*"],  # 追記により追加
)


@app.get("/")
async def root():
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
        print(f"word: {word}")
        try:
            word_synset = wn.synset(f"{word}.n.01")
            similarity = asignmentWord_synset.wup_similarity(word_synset)
            print(f"{word}: {similarity}")

            if asignmentWord == word:
                similarity = 1.0

            if similarity is None:
                print(f"'{asignmentWord}' と '{word}' の類似度を計算できません。")

            if similarity > highscore:
                highscore = similarity
        except:
            print(f"Error: '{word}' はWordNetに存在しません。")

    return {"similarity": highscore}


# MEMO こんな感じでPOSTリクエストを送る
#  curl -X POST "http://localhost:9004/similarity" \
# -H "Content-Type: application/json" \
# -d '{"asignmentWord": "dog", "words": ["apple", "banana", "cherry"]}'
