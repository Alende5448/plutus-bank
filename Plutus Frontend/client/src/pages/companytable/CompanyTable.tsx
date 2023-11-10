/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import emptyProduct from './CompanyData';
import { deleteCompany, getCompanies } from '../../redux/action';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import DeleteModal from '../../components/DeleteModal.tsx';
import CreateCompany from '../Dashboard/Company/CreateCompany.tsx'

interface Company {
  id: number;
  companyName: string;
  investment_category: string;
  businessType: string;
  duration: number;
  roi: number;
}

const CompanyTable: React.FC = () => {
  const companiesPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [companyData] = useState<Company[]>(emptyProduct);

  // const [comp, setComp] = useState<any[]>([])

  // const getCompanies = async() => {
  //   try{
  //     const response = await axios.get(`${baseUrl}/company/get-companies`)
  //     console.log('resppp ++++++', response)
  //     setComp(response.data.company)
  //   }catch(error){
  //     console.log(error)
  //   }

  // }

  // console.log("company", comp)

  // useEffect(() => {
  //   getCompanies()
  // }, [])
  const dispatch = useDispatch() as unknown as any;


  const companies = useSelector((state: any) => state.company);

  console.log(companies);

  useEffect(() => {
    dispatch(getCompanies());
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteCompany(id))
  };

  const startIndex = (currentPage - 1) * companiesPerPage;
  const endIndex = startIndex + companiesPerPage;
  const companiesToDisplay = companies?.slice(startIndex, endIndex);

  const [modal, setModal] = useState(false)
  const [delModal, setDelModal] = useState(false)

  const openModal = (id: any) => {
    localStorage.setItem('compId', id)
    setDelModal(!delModal)
  }

  const companyId = localStorage.getItem("compId") as unknown as number

  return (
    <div className="p-4 md:p-8 lg:p-16">
      <h1 className="text-2xl md:text-3xl font-semibold text-center pb-4">
        List of Companies
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className='bg-blue-600 text-white'>
              <th className='w-1/6 py-2 px-4 text-left'>ID</th>
              <th className='w-2/6 py-2 px-4 text-left'>Company Name</th>
              <th className='w-2/6 py-2 px-4 text-left'>Duration</th>
              <th className='w-2/6 py-2 px-4 text-left'>ROI</th>
              <th className='w-1/6 py-2 px-4 text-left'>Investment Category</th>
              <th className='w-1/6 py-2 px-4 text-left'>Business Type</th>
              <th className='w-1/6 py-2 px-4 text-right'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companiesToDisplay?.map((company:any, i: number) => (
              <tr key={company.id} className='border-b hover:bg-gray-100'>
                <td className='py-2 px-4'>{i+1}</td>
                <td className='py-2 px-4'>{company.companyName}</td>
                <td className='py-2 px-4'>{company.duration}</td>
                <td className='py-2 px-4'>{company.roi}</td>
                <td className='py-2 px-4'>{company.investment_category}</td>
                <td className='py-2 px-4'>{company.businessType}</td>
                <td className='py-2 px-4 text-right'>
                  <button
                    className='bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded'
                    onClick={() => openModal(company.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="mr-2 hover:underline"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &laquo; Previous
        </button>
        <button
          className="hover:underline"
          disabled={
            currentPage === Math.ceil(companyData.length / companiesPerPage)
          }
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next &raquo;
        </button>
      </div>
      <button
        onClick={() => setModal(!modal)}
        className="bg-black w-[20%] text-white ml-[40%] h-[6vh] rounded-full hover:bg-blue-600 transform -translate-y-5 "
      >
        {" "}
        Add Company{" "}
      </button>
      {modal ? <CreateCompany /> : null}
      {delModal ? <DeleteModal onCancel={() =>setDelModal(!delModal) } onDelete={() => handleDelete(companyId)} /> : null}
    </div>
  );
};

export default CompanyTable;
