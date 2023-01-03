import React, { useContext, useEffect, useState } from "react";
import axios from "services/axios";
import Layout from "layouts/FrontendLayout";
import moment from "moment";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
// image
import noImage from "images/NoImage.gif";
import Profile from "images/Profile.jpg";
// context
import { SearchContext } from "context/SearchProvider";

export default function Home() {
   const navigate = useNavigate();
   const context = useContext(SearchContext);
   const [loading, setLoading] = useState(true);
   const [items, setItems] = useState([]);
   const [page, setPage] = useState(1);
   const [perPage] = useState(10);
   const [totalPage, setTotalPage] = useState("");

   const handlePageClick = (event) => {
      window.scroll(0, 0);
      setPage(event.selected + 1);
   };

   const onClickDetail = (id) => {
      navigate("/detail", {
         state: {
            id: id,
         },
      });
   };

   useEffect(() => {
      const getResearch = async () => {
         if (context.search && context.type) setPage(1);
         setLoading(true);
         try {
            const res = await axios({
               url: `/research/get?page=${page}&per_page=${perPage}&type=${context.type}&search=${context.search}`,
               method: "get",
            });
            setItems(res.data.data);
            setTotalPage(res.data.total_pages);
         } catch (err) {
            console.error(err);
         }
         setLoading(false);
      };
      getResearch();
   }, [page, perPage, context.type, context.search]);

   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   return (
      <Layout>
         <div className={`${loading && "h-screen"}`}>
            <div className="md:flex-row flex flex-col w-full">
               <div className="md:mt-3 flex flex-col items-center w-full">
                  {loading && (
                     <div className="flex mt-5 items-center text-center ">
                        <div role="status">
                           <svg
                              aria-hidden="true"
                              className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path
                                 d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                 fill="currentColor"
                              />
                              <path
                                 d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                 fill="currentFill"
                              />
                           </svg>
                           <span className="sr-only">Loading...</span>
                        </div>
                     </div>
                  )}
                  {!loading && (
                     <div className="md:pr-10  w-full min-h-screen">

                        {items.map((item, key) => (
                           <div
                              key={key}
                              className="rounded-xl w-full border p-5 pb-0 md:shadow-lg md:mx-4 bg-white"
                           >
                              <div className="flex items-center justify-between border-b pb-3">
                                 <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-400 ">
                                       <img alt="" src={Profile} />
                                    </div>
                                    <div className="text-sm md:text-lg text-slate-700">
                                       {item.user_name}
                                    </div>
                                 </div>
                                 <div className="flex items-center space-x-8">
                                    <div className="text-xs bg-slate-100 p-1 rounded-full text-neutral-500">
                                       {moment(item.date, "YYYYMMDD HH:mm:ss").fromNow()}
                                    </div>
                                 </div>
                              </div>
                              {/* block research ================================================================================ */}
                              <div className="md:flex mt-4 mb-6 ">
                                 <div className="md:w-2/6 flex justify-center items-center">
                                    <img alt="" className="object-cover max-h-56 w-full" src={item.image ? item.image : noImage} />
                                 </div>
                                 <div className="lg:relative w-full md:ml-3">
                                    <div className="break-all mt-5 md:mt-0 first-letter:mb-3 font-semibold md:font-medium  text-sm md:text-base ">
                                       {item.title.length > 150
                                          ? `${item.title.substring(0, 150)} . . .`
                                          : item.title}
                                    </div>
                                    <div className="break-all text-sm text-neutral-600">
                                       {item.description.length > 500
                                          ? `${item.description.substring(0, 500)} . . .`
                                          : item.description}
                                    </div>
                                    <div className="break-all text-sm font-medium underline">
                                       Institute : {item.rights}
                                    </div>

                                    <div className="lg:absolute lg:bottom-0 mt-5 flex items-end">
                                       <div className="flex items-center justify-between text-slate-500">
                                          <div className="flex space-x-4 md:space-x-8">
                                             <button onClick={() => onClickDetail(item.id)} className="text-xs md:text-sm bg-indigo-100 p-2 rounded-full">
                                                Detail
                                             </button>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>

                        ))}
                        {/* if no data  */}
                        {items.length === 0 && (
                           <div className="mt-4 h-screen w-full flex justify-center">No results match that query</div>
                        )}
                     </div>
                  )}
                  {totalPage && (
                     <div className={`${loading && "invisible"}`}>
                        <ReactPaginate
                           className="mt-5 flex justify-center items-center list-none mb-20 md:mb-0  gap-1"
                           breakLabel="..."
                           nextLabel="->"
                           onPageChange={handlePageClick}
                           pageRangeDisplayed={3}
                           pageCount={totalPage}
                           previousLabel="<-"
                           renderOnZeroPageCount={null}
                           pageLinkClassName="page-num"
                           previousClassName="page-num"
                           nextLinkClassName="page-num"
                           activeClassName="active"
                        />
                     </div>
                  )}
               </div>
            </div>
         </div>
      </Layout>
   );
}
