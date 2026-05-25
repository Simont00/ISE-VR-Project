export default function Navbar() {
  return (
    <div className="w-full h-14 bg-gray-800 flex items-center justify-between px-6 shadow-lg">
      <h1 className="text-xl font-bold text-blue-400">
        Traffic AI Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-300">Admin</span>
        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
      </div>
    </div>
  );
}