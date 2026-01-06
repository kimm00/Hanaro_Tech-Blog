import { addStopWord, deleteStopWord, getStopWords } from './action';

export default async function StopWordsPage() {
  const stopwords = await getStopWords();

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="font-bold text-xl">🚫 금칙어 관리</h1>

      {/* 추가 폼 */}
      <form action={addStopWord} className="flex gap-2">
        <input
          name="value"
          placeholder="금칙어 입력"
          className="flex-1 border px-3 py-2"
        />
        {/** biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button className="border px-4">추가</button>
      </form>

      {/* 목록 */}
      <ul className="space-y-2">
        {stopwords.map((w) => (
          <li
            key={w.id}
            className="flex items-center justify-between border px-3 py-2"
          >
            <span>{w.value}</span>
            <form action={deleteStopWord.bind(null, w.id)}>
              {/** biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button className="text-red-500">삭제</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
