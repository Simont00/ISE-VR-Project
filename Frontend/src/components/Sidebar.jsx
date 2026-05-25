export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 p-5">
      <h2 className="text-lg font-semibold mb-6 text-blue-400">
        Menu
      </h2>

      <ul className="space-y-4">
        <li className="hover:text-blue-400 cursor-pointer">Dashboard</li>
        <li className="hover:text-blue-400 cursor-pointer">Scenarios</li>
        <li className="hover:text-blue-400 cursor-pointer">Analytics</li>
      </ul>
    </div>
  );
}