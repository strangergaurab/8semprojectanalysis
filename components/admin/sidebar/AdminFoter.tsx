const AdminFooter = () => {
  return (
    <footer className="fixed bottom-0 w-full border-t border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            © 2024 Admin Dashboard. All rights reserved RAM LLC ACADEMY
          </p>
          <div className="flex items-center space-x-4">
            <button className="text-sm text-gray-600 hover:text-gray-900">
              Terms
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900">
              Privacy
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900">
              Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
