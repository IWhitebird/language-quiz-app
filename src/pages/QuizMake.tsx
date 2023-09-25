import { useState, ChangeEvent, FormEvent } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { IAssignment, IQuiz } from "../types";

import toast from "react-hot-toast";

interface FormDataQuiz {
  name: string;
  description: string;
  language: string;
  time: number;
}

interface FormDataAss {
  name: string;
  description: string;
  instructions: string[];
}

const QuizMake = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState<IQuiz>();

  const [formData, setFormData] = useState<FormDataQuiz>({
    name: "",
    description: "",
    language: "",
    time: 0,
  });

  const [assignmentData, setAssignmentData] = useState<FormDataAss>({
    name: "",
    description: "",
    instructions: [],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewSource, setPreviewSource] = useState<string | null>(null);

  const [mode, setMode] = useState<string>("assignment");
  const [assignmentModal, setAssignmentModal] = useState<boolean>(false);
  const [insHelper, setInsHelper] = useState<string>("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const AssignmentformChangeHandle = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAssignmentData({ ...assignmentData, [name]: value });
  };

  const instructionHandle = (e: any) => {
    if (insHelper === "") return;
    setAssignmentData((prevData) => ({
      ...prevData,
      instructions: [...prevData.instructions, insHelper],
    }));
    setInsHelper("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  async function createQuiz() {
    try {
      const postData = {
        name: formData.name,
        description: formData.description,
        language: formData.language,
        time: formData.time,
        image: imageFile,
      };

      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/quiz/createQuiz",
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setData(response.data.quiz);
      setMode("assignment");
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }

  async function draftSave() {
    try {
      const res = await createQuiz();
      if (res.status === 200) {
        toast.success("Quiz Saved Successfully");
        window.location.href = "/workshop";
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function createAssignment() {
    try {
      const postData = {
        name: assignmentData.name,
        description: assignmentData.description,
        instructions: assignmentData.instructions,
      };

      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/quiz/createAssignment",
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setAssignmentData(response.data.quiz);
      setAssignmentModal(false);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      previewFile(file);
    }
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result?.toString() || null);
    };
  };

  console.log(assignmentData);

  return (
    <>
      <Navbar />

      <div className="w-[80%] mx-auto mt-28">
        <div>
          <h1 className="text-6xl text-start font-semibold mb-4 w-full ">
            Create Quiz
            {mode === "assignment" && <span> / Assignment</span>}
          </h1>
        </div>
        <div className=" h-[1px] bg-black" />

        {mode === "quiz" && (
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex flex-row justify-evenly gap-5 mt-7"
          >
            <div className="min-w-[50%]">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-bold text-3xl mb-3"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border-2 border-black text-3xl rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-bold text-3xl mb-3"
                >
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border-2 border-black text-3xl rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="language"
                  className="block text-gray-700 font-bold text-3xl mb-3"
                >
                  Language:
                </label>
                <input
                  type="text"
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full border-2 border-black text-3xl rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="time"
                  className="block text-gray-700 font-bold text-3xl mb-3"
                >
                  Time (minutes):
                </label>
                <input
                  type="number"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full border-2 border-black text-3xl rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="flex gap-9 mt-9">
                <button
                  type="submit"
                  onClick={draftSave}
                  className="rounded-2xl bg-black w-[200px] h-[60px] text-xl text-white flex
              justify-center items-center border-2 border-black hover:border-black cursor-pointer
              hover:text-black hover:bg-white transition-all duration-200 ease-in-out hover:scale-110"
                >
                  Draft
                </button>

                <button
                  type="submit"
                  onClick={createQuiz}
                  className="rounded-2xl bg-black w-[200px] h-[60px] text-xl text-white flex
              justify-center items-center border-2 border-black hover:border-black cursor-pointer
              hover:text-black hover:bg-white transition-all duration-200 ease-in-out hover:scale-110"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="min-w-[50%] flex flex-col">
              <label
                htmlFor="image"
                className="block text-gray-700 font-bold text-3xl mb-3 ml-5"
              >
                Image Upload:
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="border-2 bg-white border-black rounded-lg w-full  mx-auto mt-5 mb-5">
                {previewSource ? (
                  <img
                    src={previewSource}
                    alt="Add thumbnail"
                    className="rounded-xl w-full min-h-[350px] max-h-[350px] object-fit"
                  />
                ) : (
                  <div className="min-h-[350px] text-4xl font-bold flex items-center justify-center mt-3 h-full w-full mx-auto">
                    <p className="my-auto">Add thumbnail</p>
                  </div>
                )}
              </div>
              <label
                htmlFor="image"
                className="ml-10 rounded-2xl bg-black w-[160px] h-[60px] text-xl text-white flex
              justify-center items-center border-2 border-black hover:border-black cursor-pointer
              hover:text-black hover:bg-white transition-all duration-200 ease-in-out hover:scale-110"
              >
                Upload
              </label>
            </div>
          </form>
        )}

        {mode === "assignment" && (
          <>
            <div className="w-full h-full ">
            
              {assignmentModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md overflow-scroll">
                  <div className="bg-white w-1/2 min-h-1/2 border-2 border-black p-4 rounded-lg shadow-lg">
                    <form>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-between">
                          <h1 className="text-3xl font-bold">
                            Create Assignment
                          </h1>
                          <button
                            className="text-3xl"
                            onClick={() => setAssignmentModal(false)}
                          >
                            <AiOutlineClose />
                          </button>
                        </div>

                        <div className="flex flex-row gap-5 h-1/2 justify-between w-full items-start">
                          <div className="flex items-center gap-5">
                            <div className="flex flex-col">
                              <label
                                htmlFor="name"
                                className="block text-gray-700 font-bold text-3xl mb-3"
                              >
                                Name :{" "}
                              </label>
                              <input
                                onChange={AssignmentformChangeHandle}
                                value={assignmentData.name}
                                type="text"
                                name="name"
                                id="name"
                                className="w-full border-2 border-black text-3xl rounded-md
                                 py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-5">
                            <div className="flex flex-col">
                              <label
                                htmlFor="description"
                                className="block text-gray-700 font-bold text-3xl mb-3"
                              >
                                Description :{" "}
                              </label>
                              <textarea
                                onChange={AssignmentformChangeHandle}
                                value={assignmentData.description}
                                name="description"
                                id="description"
                                className="w-full border-2 border-black text-3xl rounded-md
                                py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row gap-5">
                          <div>
                            <div className="flex flex-row justify-between">
                              <label
                                htmlFor="instructions"
                                className="block text-gray-700 font-bold text-3xl mb-3"
                              >
                                Instructions :{" "}
                              </label>

                              <label
                                htmlFor="ins"
                                onClick={instructionHandle}
                                className=" bg-black w-[120px] h-[40px] text-md text-white flex justify-center 
                              border-black hover:border-black cursor-pointer rounded-2xl items-center border-2
                              hover:text-black hover:bg-white transition-all duration-200 ease-in-out hover:scale-110"
                              >
                                Add Instruction
                              </label>
                            </div>

                            <input
                              value={insHelper}
                              onChange={(e) => setInsHelper(e.target.value)}
                              type="text"
                              name="instructions"
                              id="instructions"
                              className="w-full border-2 border-black text-3xl rounded-md
                              py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                            />
                          </div>
                        </div>

                        <div>
                          {assignmentData.instructions.map((ins, i) => (
                            <div key={i} className="flex flex-row gap-5 mt-5">
                              <p className="text-2xl font-bold">{i + 1} : </p>
                              <p className="text-2xl">{ins}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-center">
                          <button
                            onClick={createAssignment}
                            className="rounded-2xl bg-black  w-[200px] h-[60px] text-xl text-white flex
                           justify-center items-center border-2 border-black hover:border-black cursor-pointer
                          hover:text-black hover:bg-white transition-all duration-200 ease-in-out hover:scale-110"
                          >
                            Create
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-6">
                <div className="mt-10 flex justify-end">
                  <button
                    onClick={() => setAssignmentModal(true)}
                    className="rounded-2xl bg-black 
                    w-[200px] h-[60px] text-xl text-white flex justify-center items-center border-2 border-black hover:border-black cursor-pointer
                  hover:text-black hover:bg-white transition-all duration-200 ease-in-out hover:scale-110"
                  >
                    Add
                  </button>
                </div>

                <div className="w-[90%]">
                  {data?.assignment.map((ass: IAssignment, i: any) => (
                    <div
                      key={i}
                      className="w-full flex flex-col bg-black text-white
                          justify-between items-center content-center gap-3"
                    >
                      <p>Assignment No.{i + 1}</p>
                      <p>{ass.name}</p>
                      <p>{ass.questions.length} Questions</p>
                      <p>{ass.maxscore}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default QuizMake;
