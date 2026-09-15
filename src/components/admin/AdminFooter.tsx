export default function AdminFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="flex min-h-[56px] flex-col items-center justify-between gap-2 px-4 py-3 text-[10px] text-gray-400 sm:flex-row sm:px-6 lg:px-7">
        <p>
          © {new Date().getFullYear()} Sarzameen.com. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <span>Admin Panel</span>

          <span className="hidden text-gray-300 sm:inline">|</span>

          <span>
            Crafted with <span className="text-red-500">♥</span> by Sarzameen
            Team
          </span>
        </div>
      </div>
    </footer>
  );
}