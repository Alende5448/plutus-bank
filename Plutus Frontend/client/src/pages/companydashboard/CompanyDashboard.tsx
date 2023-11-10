/* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiOutlineArrowUp,
} from "react-icons/ai";
import CompanyTable from "../companytable/CompanyTable";
// import transactions from "../Dashboard/Transaction/transactions";
import Img1 from "../companydashboard/img1.jpeg";
import Img2 from "../companydashboard/img2.jpeg";
import Img3 from "../companydashboard/img3.jpeg";
import Img4 from "../companydashboard/img4.jpeg";
import Img5 from "../companydashboard/img5.jpeg";
import TransactionsList from "../Dashboard/Transactions/TransactionsList";
import { transactions } from "../Dashboard/Routes";
function CompanyDashboard() {
  // const dispatch = useDispatch() as unknown as any;
  // const getTransactions = useSelector((state: any) => state.transactions);
  // const companiesPerPage = 5;
  // const [currentPage, setCurrentPage] = useState(1);

  // const startIndex = (currentPage - 1) * companiesPerPage;
  // const endIndex = startIndex + companiesPerPage;

  // const transactionsToDisplay = getTransactions.slice(startIndex, endIndex);

  // console.log(transactions);

  // useEffect(() => {
  //   dispatch(getTransactions());
  // }, []);
  return (
    <div className="flex  gap-4  flex-col  lg:flex-row  md:flex-col overflow-hidden lg:w-full pl-10">
      <div className=" flex-1">
        <div className="flex flex-col md:px-0 sm:flex-col sm:ml-32  md:gap-0 md:flex-row mt-10 gap-6 w-96 lg:w-full md:m-0 sm:justify-center md:w-full md:ml-0">
          <div className="   bg-[#ebf3f9] ml-10 p-10  ">
            <div className="inline-flex   gap-x-32">
              <h1 className="font-semibold sm:text-sm">Total Balance</h1>
              <div className="flex ">
                <AiOutlineArrowUp className="w-6 bg-[#2ab4ad] rounded-full fill-white h-4 mx-2" />
                <span className="ml-auto">2%</span>
              </div>
            </div>
            <h3 className="text-3xl mt-4 font-semibold  ">USD 10,000.00</h3>
            <div className="flex gap-x-16 my-4">
              <div className="flex flex-col ">
                <div className="flex ">
                  <AiFillCaretUp className="fill-lime-500 w-6" />

                  <span className="text-sm">Income</span>
                </div>
                <span className="font-semibold">USD 30,000.00</span>
              </div>
              <div className="flex flex-col">
                <div className="flex ">
                  <AiFillCaretDown className="fill-red-500 w-6" />
                  <span className="text-sm"> Expenses</span>
                </div>
                <span className="font-semibold">USD 20,000.00</span>
              </div>
            </div>
          </div>

          <div className=" bg-[#ebf3f9] ml-10 p-10 ">
            <div className="flex mx-8 py-4 gap-x-20">
              <h1 className="font-semibold sm:text-sm">Total Savings</h1>
              <div className=" flex items-center">
                <AiOutlineArrowUp className=" w-6 bg-[#2ab4ad] rounded-full fill-white h-4 mx-2" />
                <span>2%</span>
              </div>
            </div>
            <h3 className="text-3xl ml-6 font-semibold  ">USD 5000.00</h3>
            <div className="flex ml-6 my-4">
              {/* <div>
                <h1>Bar chart</h1>
              </div> */}
            </div>
          </div>
        </div>
        <div className=" ml-0 pr-20 text-xs w-[34rem] md:w-full md:items-center sm:w-fit">
          <CompanyTable />
        </div>
      </div>
      <div className="bg-[#ebf3f9] sm:w-fit md:w-fit w-full  lg:w-96 h-screen  ">
        {/* <h2 className="font-semibold m-6">Transactions</h2>
        <div className="inline-flex gap-4 w-auto p-4">
          <p>All</p>
        </div> */}

        <div className=" ml-10 pr-20 md:w-full md:flex md:flex-col md:items-center ">
          <TransactionsList userTransactions={transactions} />
        </div>
        <div>
          {/* <div>
            {transactionsToDisplay?.map((transactions: any) => (
              <p key={transactions.id}>{transactions.transactions}</p>
            ))}
          </div> */}
        </div>
        <div className=" bg-[#1E1F27] text-white md:w-full">
          <p className="p-4">Quick Transfer</p>
          <div className="flex gap-2 p-2 rounded-sm">
            <div>
              <img
                src={Img1}
                alt=""
                className="h-20 w-20 rounded-full object-cover"
              />
              <p>Maria Purple</p>
            </div>
            <div>
              <img
                src={Img2}
                alt=""
                className="h-20 w-20 rounded-full object-cover"
              />
              <p>Leonard Smith</p>
            </div>
            <div>
              <img
                src={Img3}
                alt=""
                className="h-20 w-20 rounded-full object-cover"
              />
              <p>Oscar Wild</p>
            </div>
            <div>
              <img
                src={Img4}
                alt=""
                className="h-20 w-20 rounded-full object-cover"
              />
              <p>Karen Wild</p>
            </div>
            <div>
              <img
                src={Img5}
                alt=""
                className="h-20 w-20 rounded-full object-cover"
              />
              <p>Maria Purple</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDashboard;
