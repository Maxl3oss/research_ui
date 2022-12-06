import React, { useState, useEffect } from 'react'
import Layout from "layouts/FrontendLayout";
import axios from "services/axios";

const AddResearch = () => {

   const user = JSON.parse(localStorage.getItem("user"));
   const [imageSrc, setImageSrc] = useState("");
   const [research, setResearch] = useState({
      title: "",
      title_alternative: "",
      creator: "",
      subject: "",
      publisher: "",
      contributor: "",
      date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      source: "",
      rights: "",
      description: ""
   });
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

   const handleSubmit = async (e) => {
      e.preventDefault();
      // console.log(research);
      const formData = new FormData();
      formData.append("pdf", researchFiles.pdf);
      formData.append("images", researchFiles.image);
      formData.append("info", JSON.stringify(research));
      console.log(...formData);
      try {
         await axios({
            url: "research/post",
            headers: {
               Authorization: localStorage.getItem('token').split(/["]/g).join(""),
            },
            method: "post",
            data: formData
         }).then((res) => {
            console.log(res);
         })
      } catch (err) {
         alert(err);
      }
   }
   useEffect(() => {
      console.log("u");
   }, [researchFiles]);

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
                              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                           </div>
                           {researchFiles.image && (
                              <img src={imageSrc} alt="" className="h-full" />
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
                        contributor
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
                     <input onChange={(e) => handleFile(e)} id="formFileSm" type="file" accept="application/pdf" className="w-full p-2 border border-solid rounded border-gray-300" />
                  </div>

                  <div className="flex justify-end items-center mt-10">
                     <button onClick={(e) => handleSubmit(e)} className="px-5 py-3 bg-blue-600 text-white rounded">Submit</button>
                  </div>
               </form>
            </div>
         </div>
      </Layout >)
}

export default AddResearch