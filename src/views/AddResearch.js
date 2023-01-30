import React, { useState, useEffect } from 'react'
import Layout from "layouts/FrontendLayout";
import axios from "services/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddResearch = () => {

   // const { user_id } = JSON.parse(localStorage.getItem("user"));
   const localISOTime = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, -1);
   const navigate = useNavigate();
   const [imageSrc, setImageSrc] = useState("");
   const [errMsg, setErrMsg] = useState("");
   const [isSuccess, setIsSuccess] = useState(false);
   const [loading, setLoading] = useState(false);
   const [research, setResearch] = useState({
      user_id: null,
      title: null,
      title_alternative: null,
      creator: null,
      subject: null,
      publisher: null,
      contributor: null,
      date: localISOTime.slice(0, 19).replace('T', ' '),
      source: "-",
      rights: null,
      description: null
   });
   const [researchFiles, setResearchFiles] = useState({
      image: null,
      pdf: null
   });

   const handleImage = (e) => {
      let file_image = e.target.files[0];

      if (file_image.type.startsWith('image/')) {
         const reader = new FileReader();
         setImageSrc(URL.createObjectURL(file_image));

         reader.onloadend = () => {
            setResearchFiles(current => {
               return {
                  ...current, image: reader.result
               }
            });
         };
         reader.readAsDataURL(file_image);
      } else {
         setErrMsg("Invalid file type(image)");
      }
   }

   const handleFile = (e) => {
      let file_pdf = e.target.files[0];
      if (file_pdf.type === 'application/pdf') {
         const reader = new FileReader();

         reader.onloadend = () => {
            setResearchFiles(current => {
               return {
                  ...current, pdf: reader.result
               }
            });
         };
         reader.readAsDataURL(file_pdf);

      } else {
         document.getElementById("formFilePDF").value = "";
         setErrMsg("Invalid file type(pdf)");
      }
   }

   const checkProperties = (obj) => {
      for (var key in obj) {
         if (obj[key] === null || obj[key] === "") {
            return true;
         }
      }
   }

   const validateForm = () => {
      // check image size on submit
      if (!researchFiles.image && !researchFiles.pdf) {
         setErrMsg("Please choose a file(image & pdf)");
         setIsSuccess(false);
         return
      }

      const MAX_FILE_SIZE = 2048 // 5MB
      const stringLength = (researchFiles.image.length - 'data:image/png;base64,'.length)
      const fileSizeKiloBytes = (4 * Math.ceil((stringLength / 3)) * 0.5624896334383812) / 1024;
      if (fileSizeKiloBytes > MAX_FILE_SIZE) {
         setErrMsg("File(image) size is greater than maximum limit(2mb)");
         setIsSuccess(false);
         return
      }
      // check form
      if (checkProperties(research) || checkProperties(researchFiles)) {
         setErrMsg("Please complete this form");
         setIsSuccess(false);
         return
      }
      setErrMsg("");
      setIsSuccess(true);
   }

   const handleSubmit = async (e) => {
      e.preventDefault();
      validateForm();
   }

   useEffect(() => {
      if (isSuccess) {
         const formData = new FormData();
         formData.append("pdf", researchFiles.pdf);
         formData.append("images", researchFiles.image);
         formData.append("info", JSON.stringify(research));
         // console.log(...formData);
         setLoading(true);
         axios({
            url: "research/post",
            headers: { Authorization: localStorage.getItem('token').split(/["]/g).join(""), },
            method: "post",
            data: formData
         }).then(() => {
            // console.log(res);
            setLoading(false);
            Swal.fire({
               position: 'center',
               icon: 'success',
               text: 'Save your research.',
               showConfirmButton: false,
               timer: 1000
            });
            navigate("/profile");
         }).catch((err) => {
            setLoading(false);
            if (err.response?.status === 403) {
               Swal.fire({
                  icon: 'warning',
                  text: 'Token time out!',
                  confirmButtonColor: "rgb(29 78 216)",
               }).then(() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  navigate("/signIn");
               });
            } else if (err.response?.status === 401) {
               Swal.fire({
                  icon: 'warning',
                  text: 'Token not found',
                  confirmButtonColor: "rgb(29 78 216)",
               }).then(() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  navigate("/signIn");
               });
            }
         })
      }
   }, [isSuccess, navigate, research, researchFiles]);

   useEffect(() => {
      if (JSON.parse(localStorage.getItem("user"))) {
         setResearch(current => {
            return {
               ...current, user_id: JSON.parse(localStorage.getItem("user")).user_id
            }
         });
      } else {
         navigate("/signIn");
      }
   }, [navigate]);

   useEffect(() => {
      // console.log(localISOTime.slice(0, 19).replace('T', ' '));
      // console.log(new Date().toISOString().slice(0, 19).replace('T', ' '));
      setErrMsg("");
   }, [researchFiles, research]);

   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   return (
      <Layout>
         <div className="min-h-screen md:pt-5 md:px-5 bg-slate-200  flex justify-center items-start">
            <div className="mt-1 mb-14 md:mb-10 p-3 md:p-8 w-full bg-white shadow-md  rounded-xl">
               <form>
                  <div className="flex justify-center items-center">
                     <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                           <div className={`${researchFiles.image ? "hidden" : "flex flex-col items-center justify-center pt-5 pb-6"}`}>
                              <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 1MB)</p>
                           </div>
                           {researchFiles.image && (
                              <img src={imageSrc} alt="" className="h-full" />
                           )}
                           <input id="dropzone-file" type="file" accept="image/*" onChange={(e) => { handleImage(e); }} className="hidden" />
                        </label>
                     </div>
                  </div>
                  <hr className="mb-3" />

                  <div className="flex flex-col mb-1 md:flex-row items-start">
                     <div className="text-lg md:w-2/12 ">
                        title
                     </div>
                     <input
                        onChange={e => setResearch(current => {
                           return {
                              ...current, title: e.target.value
                           }
                        })}
                        type="text" className="w-full p-2 text-sm border-solid border rounded" required />
                  </div>

                  <div className="flex flex-col mb-1 md:flex-row items-start">
                     <div className="text-lg md:w-2/12 ">
                        Title Alternative
                     </div>
                     <input
                        onChange={e => setResearch(current => {
                           return {
                              ...current, title_alternative: e.target.value
                           }
                        })}
                        type="text" className="w-full p-2 text-sm border-solid border rounded" required />
                  </div>

                  <div className="flex flex-col mb-1 md:flex-row items-start">
                     <div className="text-lg md:w-2/12 ">
                        Creator
                     </div>
                     <input
                        onChange={e => setResearch(current => {
                           return {
                              ...current, creator: e.target.value
                           }
                        })}
                        type="text" className="w-full p-2 text-sm border-solid border rounded" required />
                  </div>

                  <div className="flex flex-col mb-1 md:flex-row items-start">
                     <div className="text-lg md:w-2/12 ">
                        Subject
                     </div>
                     <input
                        onChange={e => setResearch(current => {
                           return {
                              ...current, subject: e.target.value
                           }
                        })}
                        type="text" className="w-full p-2 text-sm border-solid border rounded" />
                  </div>

                  <div className="flex flex-col mb-1 md:flex-row items-start">
                     <div className="text-lg md:w-2/12">
                        Description
                     </div>
                     <textarea
                        onChange={e => setResearch(current => {
                           return {
                              ...current, description: e.target.value
                           }
                        })}
                        id="comment" rows="4" className="w-full p-2 text-sm border-solid border rounded" required></textarea>
                  </div>

                  <div className="flex flex-col mb-1 md:flex-row items-start">
                     <div className="text-lg md:w-2/12 ">
                        Publisher
                     </div>
                     <input
                        onChange={e => setResearch(current => {
                           return {
                              ...current, publisher: e.target.value
                           }
                        })}
                        type="text" className="w-full p-2 text-sm border-solid border rounded" />
                  </div>

                  <div className="flex flex-col mb-1 md:flex-row items-start">
                     <div className="text-lg md:w-2/12 ">
                        Contributor
                     </div>
                     <input
                        onChange={e => setResearch(current => {
                           return {
                              ...current, contributor: e.target.value
                           }
                        })}
                        type="text" className="w-full p-2 text-sm border-solid border rounded" />
                  </div>

                  <div className="flex flex-col mb-1 md:flex-row items-start">
                     <div className="text-lg md:w-2/12 ">
                        Source
                     </div>
                     <input
                        onChange={e => setResearch(current => {
                           return {
                              ...current, source: e.target.value
                           }
                        })}
                        type="text" className="w-full p-2 text-sm border-solid border rounded" />
                  </div>

                  <div className="flex flex-col mb-1 md:flex-row items-start">
                     <div className="text-lg md:w-2/12 ">
                        Rights
                     </div>
                     <input
                        onChange={e => setResearch(current => {
                           return {
                              ...current, rights: e.target.value
                           }
                        })}
                        type="text" className="w-full p-2 text-sm border-solid border rounded" />
                  </div>

                  {/* file pdf download*/}
                  <div className="flex flex-col mt-1 mb-1 md:flex-row items-start">
                     <div className="text-lg md:w-2/12 ">
                        Document
                     </div>
                     <label className="block w-full">
                        <span className="sr-only">Choose File</span>
                        <input onChange={(e) => handleFile(e)} id="formFilePDF" type="file" accept="application/pdf" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                     </label>
                  </div>

                  {/* errMsg */}
                  <div className={`${errMsg === "" && "hidden"}`}>
                     <span className="w-full flex justify-center items-center p-5 mt-5 bg-red-50 text-red-600 font-bold">
                        {errMsg}
                     </span>
                  </div>
                  {/* loading */}
                  {loading && (
                     <div className="flex mt-5 items-center justify-center text-center ">
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
                  <div className="flex justify-end items-center mt-10">
                     <button onClick={(e) => handleSubmit(e)} className="px-5 py-3 text-blue-100 bg-blue-600 font-bold rounded-full">Submit</button>
                  </div>
               </form>
            </div>
         </div>
      </Layout >
   )
}

export default AddResearch