const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 text-center sm:text-left">
        <p className="mb-2 sm:mb-0">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-medium text-gray-800">PetClinic Management System</span>
        </p>
        <p>
          Developed by{" "}
          <span className="font-semibold text-green-700">Praveen</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
