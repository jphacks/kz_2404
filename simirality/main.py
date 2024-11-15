from typing import List

import nltk
from fastapi import FastAPI, HTTPException
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
    assignmentWord: str
    words: List[str]

@app.post("/similarity")
async def similarity(reqWords: Words):
    assignmentWord = reqWords.assignmentWord
    words = reqWords.words

    try:
        highscore, highscore_word = calcuSimilarity(assignmentWord, words)
    except Exception as e:
        # 例外処理
        print(f"Error: 類似度の計算に失敗しました。課題が存在しない可能性があります。詳細: {str(e)}")
        raise HTTPException(status_code=400, detail="類似度の計算に失敗しました。")

    return {"similarity": highscore, "highscoreWord": highscore_word}

# 類似度の計算
def calcuSimilarity(assignmentWord, words):
    assignmentWord_synset = wn.synset(f"{assignmentWord}.n.01")

    highscore = 0
    highscore_word = ""

    for word in words:
        print(f"word: {word}")
        try:
            similarity = calculate(assignmentWord_synset, word, assignmentWord)

            print(f"similarity: {similarity}")

            if similarity > highscore:
                highscore = similarity
                highscore_word = word
        except Exception as e:
            print(f"Error: '{e}'")

        # WordNet にない形式を検索
        wordByMorphy = wn.morphy(word)
        print(f"wordByMorphy: {wordByMorphy}")
        if wordByMorphy is not None:
            try:
                similarityByMorphy = calculate(assignmentWord_synset, wordByMorphy, assignmentWord)

                print(f"similarity: {similarityByMorphy}")

                if highscore < similarityByMorphy:
                    highscore = similarityByMorphy
                    highscore_word = word

            except Exception as e:
                print(f"Error: '{e}'")

    return highscore, highscore_word

def calculate(assignmentWord_synset, word, assignmentWord):
    if assignmentWord == word:
        return 1.0

    # word_synset = wn.synset(f"{word}.n.01")
    try:
        word_synset = wn.synset(f"{word}.n.01")
    except Exception as e:
        print(f"Error: WordNetに '{word}' のsynsetが見つかりません。詳細: {str(e)}")
        return 0

    similarity = assignmentWord_synset.wup_similarity(word_synset)

    if similarity is None:
        print(f"'{assignmentWord}' と '{word}' の類似度を計算できません。")
        return 0

    return similarity


# MEMO こんな感じでPOSTリクエストを送る
#  curl -X POST "http://localhost:9004/similarity" \
# -H "Content-Type: application/json" \
# -d '{"assignmentWord": "dog", "words": ["apple", "banana", "cherry"]}'
