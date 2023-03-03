import React, { useContext, useState, useEffect } from 'react'
import Layout from "layouts/BackendLayout";
import axios from "services/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ResearchContext } from 'context/ResearchProvider';

const BackEditResearch = () => {
   const context = useContext(ResearchContext);
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false);
   const [imageSrc, setImageSrc] = useState("");
   const [errMsg, setErrMsg] = useState("");
   const [rows, setRows] = useState(1);
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
      pdf_name: null,
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
                  ...current, pdf: reader.result, pdf_name: file_pdf.name
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
      if (isSuccess && !loading) {
         const formData = new FormData();
         formData.append("pdf", researchFiles.pdf);
         formData.append("images", researchFiles.image);
         formData.append("info", JSON.stringify(research));
         // console.log(...formData);
         setLoading(true);
         try {
            const updateResearch = async () => {
               await axios({
                  url: "research/update",
                  headers: {
                     Authorization: localStorage.getItem('token').split(/["]/g).join(""),
                  },
                  method: "post",
                  data: formData
               }).then((res) => {
                  // console.log(res);
                  setLoading(false);
                  Swal.fire({
                     position: 'center',
                     icon: 'success',
                     text: 'Save your research.',
                     showConfirmButton: false,
                     timer: 1000
                  });
                  navigate("/backend/research");
               })
            }
            updateResearch();
         } catch (err) {
            setLoading(false);
            // console.log(err.response);
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
   }, [isSuccess, research, navigate, researchFiles, loading]);

   const onClickDeletePdf = () => {
      setResearchFiles(current => {
         return {
            ...current, pdf_name: null
         }
      });
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
                        image: result[0].image,
                        pdf: result[0].file_pdf,
                        pdf_name: result[0].file_pdf.split("/").slice(-1)[0]
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
         navigate("/backend/research");
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
      if (research) {
         setRows(research.description.split("\n").length);
      }
   }, [researchFiles, research]);

   // text area
   const handleChange = () => {
      setRows(research.description.split("\n").length);
   };

   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   return (
      <Layout>
         <div className="min-h-screen md:pt-5 md:px-5  flex justify-center items-start">
            <div className="mt-1 mb-14 md:mb-10 p-3 md:p-8 w-full  shadow-md  rounded-xl bg-neutral-900">
               <div className="flex md:justify-start justify-center text-3xl font-light mb-5">Edit Research</div>
               <form>
                  <div className="mb-3 flex justify-center items-center">
                     <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-neutral-700 border-dashed rounded-lg cursor-pointer bg-dark">
                           <div className={`${researchFiles.image ? "hidden" : "flex flex-col items-center justify-center pt-5 pb-6"}`}>
                              <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                              <p className="mb-2 text-sm text-gray-500 "><span className="font-semibold">Click to upload</span> or drag and drop</p>
                              <p className="text-xs text-gray-500 ">SVG, PNG, JPG or GIF (MAX. 1MB)</p>
                           </div>
                           {researchFiles.image && (
                              <img src={imageSrc || researchFiles.image} alt="" className="h-full" />
                           )}
                           <input id="dropzone-file" type="file" accept="image/*" onChange={(e) => handleImage(e)} className="hidden" />
                        </label>
                     </div>
                  </div>

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
                        type="text" className="input-edr" required />
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
                        type="text" className="input-edr" required />
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
                        type="text" className="input-edr" required />
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
                        type="text" className="input-edr" />
                  </div>

                  <div className="flex flex-col mb-1 md:flex-row items-start">
                     <div className="text-lg md:w-2/12">
                        Description
                     </div>
                     <textarea
                        onChange={(e) => {
                           handleChange();
                           setResearch(current => {
                              return {
                                 ...current, description: e.target.value
                              }
                           })
                        }}
                        rows={rows}
                        value={research.description}
                        id="comment" className="input-edr min-h-fit overflow-hidden" required>
                     </textarea>
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
                        type="text" className="input-edr" />
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
                        type="text" className="input-edr" />
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
                        type="text" className="input-edr" />
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
                        type="text" className="input-edr" />
                  </div>

                  {/* file pdf download*/}
                  <div className="flex flex-col mt-1 mb-1 md:flex-row items-start">
                     <div className="text-lg md:w-2/12 ">
                        Document
                     </div>

                     {typeof researchFiles.pdf_name === "string" ?
                        (
                           <div className="w-full flex">
                              <div
                                 className={(researchFiles.pdf_name ? "text-green-900 bg-green-400 rounded-full " : "text-red-50 bg-red-600 rounded-full ") + "flex px-2 py-1 break-words text-sm text-slate-800"}>
                                 {researchFiles.pdf_name}
                              </div>
                              <button
                                 onClick={() => onClickDeletePdf()}
                                 className="flex ml-5 px-2 text-red-50 bg-red-600 rounded-full items-center">
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
                  {/* errMsg */}
                  <div className={`${errMsg === "" && "hidden"}`}>
                     <span className="w-full flex justify-center items-center p-5 mt-5 text-red-50 bg-red-600 font-bold">
                        {errMsg}
                     </span>
                  </div>
                  {/* submit */}
                  <div className="flex justify-between items-center mt-10">
                     <button onClick={() => navigate("/backend/research")} className="px-5 py-3 text-gray-600 bg-gray-100 font-bold rounded-full">Cancel</button>
                     <button onClick={(e) => handleSubmit(e)} className="px-5 py-3 text-blue-100 bg-blue-600 font-bold rounded-full">Submit</button>
                  </div>
               </form>
            </div>
         </div >
      </Layout >)
}

export default BackEditResearch;

