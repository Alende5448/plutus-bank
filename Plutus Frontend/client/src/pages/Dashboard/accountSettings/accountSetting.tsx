/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BsPersonFillGear } from 'react-icons/bs';
import { BiSolidLockOpen } from 'react-icons/bi';
import { BiSolidBellRing } from 'react-icons/bi';
import { BsFillCreditCard2FrontFill } from 'react-icons/bs';
import { Link, useLocation } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { accountSettings, getInfo, updateLogo } from '../../../redux/action';


const AccountSettings: React.FC = () => {

  const dispatch = useDispatch() as unknown as any;

  const location = useLocation();

 const [formData, setFormData] = useState<LoginData>({
   firstName:"",
   lastName:"",
   address:"",
   email:"",
   city:"",
   state:"",
   zipCode:"",
   country:""
 });
  
  const [fileData, setFileData] = useState({}) 

  const [file, setFile] = useState('') 
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "file") {

      setFileData({
        image: e.target.files[0]
      })

      setFile(URL.createObjectURL(e.target.files[0]))
      console.log('file', fileData)
    } else {
      console.log(formData)
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const updateImage = (e: any) => {
    e.preventDefault()
    dispatch(updateLogo(fileData))
  }

 
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      dispatch(accountSettings(formData))
    } catch (error) {
      console.error(error); // Handle error
    }
  };

  const users = useSelector((state:any) => state.user.user)



  useEffect(() => {
    dispatch(getInfo())
  }, [])

  console.log("users", users)
  // const [successMessage, setSuccessMessage] = useState<string | null>('null');
  
  // const handleSubmit = async (e: React.FormEvent) => {
  //   try {
  //       e.preventDefault();
  //     // ...existing code to make API request
  //     await axios.put('/user/updateAccount', formData);
  //     setSuccessMessage('Account settings updated successfully!');
  //     toast.success('Account settings updated successfully!');
  //   } catch (error) {
  //    // ...error handling code
  //   }
  // };

    // const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // const [previewImage, setPreviewImage] = useState<string | null>(null);
  
    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const file = e.target.files && e.target.files[0];
    //   if (file) {
    //     setSelectedFile(file);
  
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //       if (typeof reader.result === 'string') {
    //         setPreviewImage(reader.result);
    //       }
    //     };
    //     reader.readAsDataURL(file);
    //   }
    // };

  return (
    <div className="p-4 md:p-8 lg:p-16 ml-[15%]">
      <form>
        {/* Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 overflow-x-auto w-10/12">
          <Link to="/dashboard/accountsettings" className="bg-slate-50 hover:bg-blue-500 p-2 rounded-md flex flex-col items-center">
            <div className="flex items-center text-left space-x-2 md:space-x-4">
              <BsPersonFillGear className="h-6 w-6 ml-2 md:ml-4 text-black" />
              <span className="text-black justify-content: flex-start text-sm md:text-base">Personal Info</span>
            </div>
          </Link>
          <Link to="/dashboard/update-profile" className="bg-slate-50 hover:bg-blue-500 p-2 rounded-md flex flex-col items-center">
            <div className="flex items-center text-left space-x-4">
                <BsFillCreditCard2FrontFill className="h-6 w-6 ml-4 text-black" />
                <span className="text-black justify-content: flex-start">Update Profile</span>
              </div>
          </Link>

          <Link to="/dashboard/notifications" className="bg-slate-50 hover:bg-blue-500 p-2 rounded-md flex flex-col items-center">
              <div className="flex items-center text-left space-x-4">
                <BiSolidBellRing className="h-6 w-6 ml-4 text-black" />
                <span className="text-black justify-content: flex-start">Notifications</span>
              </div>
          </Link>

      
        {/* Password and Security */}
        <div className="flex flex-col items-center">
          <Link to="/changePassword"  className="bg-slate-50 hover:bg-blue-500 p-2 rounded-md flex flex-col items-center">
            <div className="flex items-center text-left space-x-4">
              <BiSolidLockOpen className="h-6 w-6 ml-4 text-black" />
              <span className="text-black justify-content: flex-start">Password and Security</span>
            </div>
          </Link >
        </div>
          
          {/* Other Navigation Links */}
          {/* Add other navigation links here */}
        </div>

        {/* Form Section */}
          {location.pathname === "/dashboard/update-profile" && (
            <>
            <div className="space-y-4 w-8/12">
              {/* Personal Info Fields */}
              <div className="flex items-center space-x-2">
                {!file ? <label htmlFor="fileInput" className="w-24 ml-2 mb-0 h-24 flex items-center justify-center rounded-full bg-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.293 12.293a1 1 0 011.414 0L10 17.586l5.293-5.293a1 1 0 111.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v9a1 1 0 11-2 0V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </label> :
                  <img src={file} alt="hsdjh" className='h-[100px] w-[100px] rounded-[50%] object-cover object-top' />}
                {file ? <button className='w-fit bg-black text-white py-2 rounded-md' onClick={updateImage}>Upload Image</button> : null}
                <input type="file" name="file" id="fileInput" className="hidden" onChange={handleInputChange} />
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  First Name
                  <input onChange={handleInputChange}
                    className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                    placeholder="First Name"
                    name="firstName"
                  />
                </label>

                <label className="flex flex-col">
                  Last Name
                  <input onChange={handleInputChange}
                    className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                    placeholder="Last Name"
                    name="lastName"
                  />
                </label>

                {/* Add other input fields here */}
              </div>

              <label className="flex flex-col">
                Email
                <input onChange={handleInputChange}
                  className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                  placeholder="mail@email.com"
                  name="email"
                />
              </label>

              <label className="flex flex-col">
                Phone Number
                <input onChange={handleInputChange}
                  className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                  placeholder="+000-12345678"
                  name="phoneNumber"
                />
              </label>

              <label className="flex flex-col">
                Street Address
                <input onChange={handleInputChange}
                  className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                  placeholder="2 MainLand, Lagos"
                  name="address"
                />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  ZIP
                  <input onChange={handleInputChange}
                    className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                    placeholder="0000"
                    name="zipCode"
                  />
                </label>

                <label className="flex flex-col">
                  City
                  <input onChange={handleInputChange}
                    className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                    placeholder="Lagos"
                    name="city"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  State
                  <input onChange={handleInputChange}
                    className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                    placeholder="Abuja"
                    name="state"
                  />
                </label>

                <label className="flex flex-col">
                  Country
                  <input onChange={handleInputChange}
                    className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                    placeholder="Nigeria"
                    name="country"
                  />
                </label>
              </div>

              
                <button
                  className="w-full bg-black text-white py-2 rounded-md"
                type="submit" onClick={handleFormSubmit}>
                  Update
                </button>
            </div>  
          </>
        )}

{location.pathname === "/dashboard/accountsettings" && (
            <>
            <div className="space-y-4 w-8/12">
              {/* Personal Info Fields */}
              <div className="flex items-center space-x-2">
              {!users?.imageUrl ? <label htmlFor="fileInput" className="w-24 ml-2 mb-0 h-24 flex items-center justify-center rounded-full bg-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.293 12.293a1 1 0 011.414 0L10 17.586l5.293-5.293a1 1 0 111.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v9a1 1 0 11-2 0V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </label> :
                  <img src={users?.imageUrl} alt="hsdjh" className='h-[100px] w-[100px] rounded-[50%] object-cover object-top' />}
              {/* <button onClick={updateImage}>Click Me</button> */}
                <input type="file" name="file" id="fileInput" className="hidden" onChange={handleInputChange} />
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  First Name
                  <input 
                    className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                    placeholder={users?.firstName}
                    name="firstName"
                    readOnly
                  />
                </label>

                <label className="flex flex-col">
                  Last Name
                  <input 
                    className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                    placeholder={users?.lastName}
                    name="lastName"
                    readOnly
                  />
                </label>

                {/* Add other input fields here */}
              </div>

              <label className="flex flex-col">
                Email
                <input 
                  className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                  placeholder={users?.email}
                  name="email"
                  readOnly
                />
              </label>

              <label className="flex flex-col">
                Phone Number
                <input 
                  className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                  placeholder={users?.phoneNumber}
                  name="phoneNumber"
                  readOnly
                />
              </label>

              <label className="flex flex-col">
                Street Address
                <input 
                  className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                  placeholder={users?.address}
                  name="address"
                  readOnly
                />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  ZIP
                  <input 
                    className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                    placeholder={users?.zipCode}
                    name="zipCode"
                    readOnly
                  />
                </label>

                <label className="flex flex-col">
                  City
                  <input 
                    className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                    placeholder={users?.city}
                    name="city"
                    readOnly
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  State
                  <input 
                    className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                    placeholder={users?.state}
                    name="state"
                    readOnly
                  />
                </label>

                <label className="flex flex-col">
                  Country
                  <input 
                    className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none"
                    placeholder={users?.country}
                    name="country"
                    readOnly
                  />
                </label>
              </div>

              
                {/* <button
                  className="w-full bg-black text-white py-2 rounded-md"
                type="submit" onClick={handleFormSubmit}>
                  Update
                </button> */}
            </div>  
          </>
        )}


        {/* Other Sections */}
        {/* Add other sections similarly with input fields */}
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

  

//  return (
//     <form onSubmit={handleFormSubmit}>
//       {/* Form input fields */}
//       <button type="submit">Save</button>
//     </form>
//   )


export default AccountSettings;
