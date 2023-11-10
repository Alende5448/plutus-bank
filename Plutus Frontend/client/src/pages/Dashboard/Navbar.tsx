import { BsBellFill } from 'react-icons/bs';
import { FaUserCircle } from 'react-icons/fa';


const Navbar = () => {
  return (
    <nav className=" p-4 flex justify-between shadow-lg w-[100%]  md:pr-[8%] ml-[15%] md:ml-[7%] lg:ml-[5%] pr-[5%]">
      {/* Dashboard Name */}
      <div className="flex justify-between">
        <p className="text-grey-500 text-lg font-semibold">Dashboard</p>

        {/* User Circle Icon */}
        <div className="flex   justify-end">
          <BsBellFill className="h-4 w-4 my-auto text-black mr-2" />
          <FaUserCircle className="h-6 w-6 my-auto text-black" />
          <span className="text-black my-auto ml-4 w-[auto]">
            Obiora Kingsley
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
