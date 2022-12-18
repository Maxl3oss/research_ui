import React, { useContext, useState, useEffect } from 'react'
import Layout from "layouts/FrontendLayout";
import axios from "services/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ResearchContext } from 'context/ResearchProvider';
import { BASE_URL } from 'services/axios';

const EditResearch = () => {
   const context = useContext(ResearchContext);
   const navigate = useNavigate();
   const [imageSrc, setImageSrc] = useState("");
   const [errMsg, setErrMsg] = useState("");
   const [research, setResearch] = useState({
      research_id: "",
      user_id: "",
      file_id: "",
      title: "",
      title_alternative: "",
      creator: "",
      subject: "",
      publisher: "",
      contributor: "",
      source: "",
      rights: "",
      description: ""
   });
   const [isSuccess, setIsSuccess] = useState(false);
   const [researchFiles, setResearchFiles] = useState({
      image: null,
      pdf: null
   });

   const handleImage = (e) => {
      let file_image = e.target.files[0];
      setImageSrc(URL.createObjectURL(file_image));
      setResearchFiles(current => {
         return {
            ...current, image: file_image
         }
      });
   }

   const handleFile = (e) => {
      let file_pdf = e.target.files[0];
      setResearchFiles(current => {
         return {
            ...current, pdf: file_pdf
         }
      });
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
      // const MIN_FILE_SIZE = 1024 // 1MB
      const MAX_FILE_SIZE = 5120 // 5MB
      const fileSizeKiloBytes = researchFiles.image.size / 1024;

      if (!researchFiles.image && !researchFiles.pdf) {
         setErrMsg("Please choose a file(image & pdf)");
         setIsSuccess(false);
         return
      }

      // if (fileSizeKiloBytes < MIN_FILE_SIZE) {
      //    setErrMsg("File(image) size is less than minimum limit");
      //    setIsSuccess(false);
      //    return
      // }
      if (fileSizeKiloBytes > MAX_FILE_SIZE) {
         setErrMsg("File(image) size is greater than maximum limit(5mb)");
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
      // console.log(isSuccess);
      validateForm();
   }

   useEffect(() => {
      if (isSuccess) {
         const formData = new FormData();
         formData.append("pdf", researchFiles.pdf);
         formData.append("images", researchFiles.image);
         formData.append("info", JSON.stringify(research));
         // console.log(...formData);
         try {
            axios({
               url: "research/update",
               headers: {
                  Authorization: localStorage.getItem('token').split(/["]/g).join(""),
               },
               method: "post",
               data: formData
            }).then((res) => {
               console.log(res);
               Swal.fire({
                  position: 'center',
                  icon: 'success',
                  text: 'Save your research.',
                  showConfirmButton: false,
                  timer: 1000
               });
               navigate("/profile");
            })
         } catch (err) {
            console.log(err.response);
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
         }
      }
   }, [isSuccess]);

   const onClickDeletePdf = () => {
      setResearchFiles(current => {
         return {
            ...current, pdf: null
         }
      });
   }

   const onClickFileDownload = async (fileID, fileName) => {
      // console.log("Click ", fileID);
      try {
         await axios({
            method: "get",
            headers: { Authorization: localStorage.getItem('token').split(/["]/g).join("") },
            url: `research/file/${fileID}/download`,
            responseType: "blob"
         }).then((res) => {
            // console.log(res.data);
            // download file pdf
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${fileName}`;
            link.click();
         });
      } catch (err) {
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
               text: 'Token not found!',
               confirmButtonColor: "rgb(29 78 216)",
            }).then(() => {
               localStorage.removeItem("user");
               localStorage.removeItem("token");
               navigate("/signIn");
            });
         } else if (!localStorage.getItem('token')) {
            Swal.fire({
               icon: 'warning',
               text: 'Please sign in!',
               confirmButtonColor: "rgb(29 78 216)",
            }).then(() => {
               localStorage.removeItem("user");
               localStorage.removeItem("token");
               navigate("/signIn");
            });
         }
      }
   }

   useEffect(() => {
      if (context.researchId) {
         const getResearch = async () => {
            try {
               await axios({
                  method: "get",
                  url: `/research/get/${context.researchId}`,
               }).then((res) => {
                  let result = res.data.data;
                  // console.log(result[0]);
                  setResearchFiles(current => {
                     return {
                        ...current,
                        image: BASE_URL + result[0].image,
                        pdf: result[0].file_pdf
                     }
                  });
                  setResearch(current => {
                     return {
                        ...current,
                        research_id: context.researchId,
                        file_id: result[0].file_id,
                        title: result[0].title,
                        title_alternative: result[0].title_alternative,
                        creator: result[0].creator,
                        subject: result[0].subject,
                        publisher: result[0].publisher,
                        contributor: result[0].contributor,
                        source: result[0].source,
                        rights: result[0].rights,
                        description: result[0].description
                     }
                  })
               })
            } catch (err) {
               console.log(err);
            }
         }
         getResearch();
      } else {
         navigate("/profile");
      }
   }, [context.researchId, navigate]);

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
      setErrMsg("");
   }, [researchFiles, research]);

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
                              <img src={imageSrc || researchFiles.image} alt="" className="h-full" />
                           )}
                           <input id="dropzone-file" type="file" accept="image/*" onChange={(e) => handleImage(e)} className="hidden" />
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
                        value={research.title}
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
                        value={research.title_alternative}
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
                        value={research.creator}
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
                        value={research.subject}
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
                        value={research.description}
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
                        value={research.publisher}
                        type="text" className="w-full p-2 text-sm border-solid border rounded" />
                  </div>

                  <div className="flex flex-col mb-1 md:flex-row items-start">
                     <div className="text-lg md:w-2/12 ">
                        contributor
                     </div>
                     <input
                        onChange={e => setResearch(current => {
                           return {
                              ...current, contributor: e.target.value
                           }
                        })}
                        value={research.contributor}
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
                        value={research.source}
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
                        value={research.rights}
                        type="text" className="w-full p-2 text-sm border-solid border rounded" />
                  </div>

                  {/* file pdf download*/}
                  <div className="flex flex-col mt-1 mb-1 md:flex-row items-start">
                     <div className="text-lg md:w-2/12 ">
                        Document
                     </div>

                     {typeof researchFiles.pdf === "string" ?
                        (
                           <div className="w-full flex">
                              <button
                                 onClick={() => researchFiles.pdf && onClickFileDownload(researchFiles.file_id, researchFiles.pdf)}
                                 className={(researchFiles.pdf ? "text-green-700 bg-green-50 rounded-full " : "text-red-700 bg-red-100 rounded-full ") + "flex px-2 py-1 cursor-pointer break-words text-sm text-slate-800"}>
                                 {researchFiles.pdf}
                                 <div className="ml-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                 </div>
                              </button>
                              <button
                                 onClick={() => onClickDeletePdf()}
                                 className="flex ml-5 px-2 bg-red-50 text-red-600 rounded-full items-center">
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                 </svg>
                                 Delete
                              </button>
                           </div>
                        ) : (
                           <label className="block w-full">
                              <span className="sr-only">Choose File</span>
                              <input onChange={(e) => handleFile(e)} id="formFileSm" type="file" accept="application/pdf" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                           </label>
                        )}
                  </div>

                  {/* errMsg */}
                  <div className={`${errMsg === "" && "hidden"}`}>
                     <span className="w-full flex justify-center items-center p-5 mt-5 bg-red-50 text-red-600 font-bold">
                        {errMsg}
                     </span>
                  </div>
                  {/* submit */}
                  <div className="flex justify-between items-center mt-10">
                     <button onClick={(e) => navigate("/profile")} className="px-5 py-3 text-gray-600 bg-gray-100 font-bold rounded-full">Cancel</button>
                     <button onClick={(e) => handleSubmit(e)} className="px-5 py-3 text-blue-100 bg-blue-600 font-bold rounded-full">Submit</button>
                  </div>
               </form>
            </div>
         </div >
      </Layout >)
}

export default EditResearch;

