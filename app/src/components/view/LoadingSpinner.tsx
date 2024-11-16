export const LoadingSpinner = () => (
	<div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
		<div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-500 mb-4" />
		<p className="text-white text-lg">読み込み中...</p>
	</div>
);
