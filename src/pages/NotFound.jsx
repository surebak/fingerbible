export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
      <div className="text-6xl font-bold text-gray-300">404</div>
      <p className="text-gray-500">페이지를 찾을 수 없습니다</p>
      <a
        href="/"
        className="mt-2 px-4 py-2 text-sm rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
      >
        홈으로 돌아가기
      </a>
    </div>
  );
}
