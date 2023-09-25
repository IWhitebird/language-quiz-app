import { useState, ChangeEvent, FormEvent } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { IAssignment, IQuestion } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { setQuiz, setMode , removeQuiz } from "../slices/createQuiz";
import { RootState } from "../reducer";
import { MdDelete } from "react-icons/md";
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

interface FormDataQuestion {
  question: string;
  points: string;
  options: string[];
  answer: string;
}

const QuizMake = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const data = useSelector((state: RootState) => state.quiz.data);
  const state = useSelector((state: RootState) => state.quiz.making);
  const mode = useSelector((state: RootState) => state.quiz.mode);

  console.log(data);

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

  const [questionData, setQuestionData] = useState<FormDataQuestion>({
    question: "",
    points: "",
    options: [],
    answer: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewSource, setPreviewSource] = useState<string | null>(null);
  const optArr = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const [assignmentModal, setAssignmentModal] = useState<boolean>(false);
  const [questionModal, setQuestionModal] = useState<any>("");
  const [insHelper, setInsHelper] = useState<string>("");
  const [showQues, setShowQues] = useState<any>(false);

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

  const QuestionFormChangeHandle = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setQuestionData({ ...questionData, [name]: value });
  };

  console.log("q", questionData);

  const instructionHandle = (e: any) => {
    if (insHelper === "") return;
    setAssignmentData((prevData) => ({
      ...prevData,
      instructions: [...prevData.instructions, insHelper],
    }));
    setInsHelper("");
  };

  const instructionHandleQue = (e: any) => {
    if (insHelper === "") return;
    let options = questionData.options;
    options.push(insHelper);
    setQuestionData((prevData) => ({
      ...prevData,
      options: options,
    }));
    setInsHelper("");
  };

  const insRemover = (ins: any) => {
    setAssignmentData((prevData) => ({
      ...prevData,
      instructions: prevData.instructions.filter((i) => i !== ins),
    }));
  };

  const insRemoverQue = (ins: any) => {
    setQuestionData((prevData) => ({
      ...prevData,
      options: prevData.options.filter((i) => i !== ins),
    }));
  };

  async function createQuiz(e: FormEvent) {
    e.preventDefault();
    const load = toast.loading("Creating Quiz");
    try {
      if (state == true) {
        dispatch(setMode("assignment"));
      }

      if (
        !imageFile ||
        !formData.name ||
        !formData.description ||
        !formData.language ||
        formData.time === 0
      ) {
        toast.error("Please fill all the fields");
        return;
      }

      const postData = new FormData();

      postData.append("name", formData.name);
      postData.append("description", formData.description);
      postData.append("language", formData.language);
      postData.append("time", formData.time.toString());
      postData.append("thumbnail", imageFile);

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
      if (response.status === 200) {
        toast.success("Quiz Created Successfully");
        dispatch(setQuiz(response.data.quiz));
        dispatch(setMode("assignment"));
      }
      return response.data;
    } catch (err) {
      console.error(err);
    } finally {
      toast.dismiss(load);
    }
  }

  async function draftSave(e: FormEvent) {
    e.preventDefault();
    const load = toast.loading("Saving Quiz");
    try {
      if (state == true) {
        dispatch(setMode("assignment"));
      }

      if (
        !imageFile ||
        !formData.name ||
        !formData.description ||
        !formData.language ||
        formData.time === 0
      ) {
        toast.error("Please fill all the fields");
        return;
      }

      const postData = new FormData();

      postData.append("name", formData.name);
      postData.append("description", formData.description);
      postData.append("language", formData.language);
      postData.append("time", formData.time.toString());
      postData.append("thumbnail", imageFile);

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
      if (response.status === 200) {
        toast.success("Quiz Saved Successfully");
        dispatch(setQuiz(response.data.quiz));
        setTimeout(() => {
        window.location.href = "/workshop";
        }, 1000);
      }
      return response.data;
    } catch (err) {
      console.error(err);
    } finally {
      toast.dismiss(load);
    }
  }
  
  async function createAssignment(e: FormEvent) {
    e.preventDefault();
    const load = toast.loading("Creating Assignment");
    try {
      const postData = new FormData();

      postData.append("name", assignmentData.name);
      postData.append("description", assignmentData.description);
      postData.append("instructions",JSON.stringify(assignmentData.instructions));

      const response = await axios.post(
        import.meta.env.VITE_API_URL + `/quiz/createAssignment/${data?._id}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Assignment Created Successfully");
        dispatch(setQuiz(response.data.quiz));
        setAssignmentModal(false);
      }
      console.log(response.data);
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      dispatch(setMode("assignment"));
      setAssignmentData({
        name: "",
        description: "",
        instructions: [],
      });
      toast.dismiss(load);
    }
  }

  async function assignmentDelete(id: any) {
    const load = toast.loading("Deleting Assignment");
    try {
      const response = await axios.delete(
        import.meta.env.VITE_API_URL +
          `/quiz/deleteAssignment/${data?._id}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Assignment Deleted Successfully");
        dispatch(setQuiz(response.data.quiz));
      }
    } catch (err) {
      console.error(err);
    } finally {
      toast.dismiss(load);
    }
  }

  async function createQuestion(e: FormEvent) {
    e.preventDefault();
    const load = toast.loading("Creating Question");
    try {
      
      if (questionData.answer == "Select") {
        toast.error("Please select the correct answer");
        return;
      }
      const postData = new FormData();

      postData.append("question", questionData.question);
      postData.append("points", questionData.points);
      postData.append('options', JSON.stringify(questionData.options));
      postData.append("answer", questionData.answer);

      const assignId = data?.assignment.find(
        (assign: any) => assign._id.toString() === questionModal.toString()
      )?._id;

      const response = await axios.post(
        import.meta.env.VITE_API_URL +
          `/quiz/createQuestion/${data?._id}/${assignId}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Question Created Successfully");
        dispatch(setQuiz(response.data.quiz));
        setQuestionModal("");
        setQuestionData({
          question: "",
          points: "",
          options: [],
          answer: "",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      toast.dismiss(load);
    }
  }

  async function questionDelete(assignId : any , quesId : any) {
    const load = toast.loading("Deleting Question");
    try {
      const response = await axios.delete(
        import.meta.env.VITE_API_URL +
          `/quiz/deleteQuestion/${data?._id}/${assignId}/${quesId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Question Deleted Successfully");
        dispatch(setQuiz(response.data.quiz));
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      toast.dismiss(load);
    }
  }

  async function publishQuizHandler() {
    const load = toast.loading("Publishing Quiz");
    try{
      const response = await axios.post(
        import.meta.env.VITE_API_URL + `/quiz/publish/${data?._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); 

      if(response.status === 200){
        toast.success("Quiz Published Successfully");
        dispatch(removeQuiz());
        window.location.href = "/workshop";
      }
    }
    catch(err){
      toast.error("Something went wrong");
      console.error(err);
    }
    finally{
      toast.dismiss(load);
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
            onSubmit={createQuiz}
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
                  value={data?.name || formData.name}
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
                  value={data?.description || formData.description}
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
                  value={data?.language || formData.language}
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
                  value={data?.time || formData.time}
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
                    src={data?.image || previewSource}
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
                    <form onSubmit={createAssignment}>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-between">
                          <h1 className="text-5xl font-bold">
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
                                className="text-3xl bg-black w-[50px] h-[40px] text-md text-white flex justify-center 
                              border-black hover:border-black cursor-pointer rounded-2xl items-center border-2
                              hover:text-black hover:bg-white transition-all duration-200 ease-in-out hover:scale-110"
                              >
                                +
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
                            <div
                              key={i}
                              className="flex flex-row gap-5 mt-5 gap"
                            >
                              <div className="flex justify-center content-center items-center">
                                <p className="text-2xl font-bold">{i + 1} : </p>
                                <p className="text-2xl">{ins}</p>
                                <div
                                  onClick={() => insRemover(ins)}
                                  className="cursor-pointer text-2xl ml-2"
                                >
                                  <AiOutlineClose />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-center">
                          <button
                            type="submit"
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

              {questionModal !== "" && (
                <>
                  <div>
                    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md overflow-scroll">
                      <div className="bg-white w-1/2 min-h-1/2 border-2 border-black p-4 rounded-lg shadow-lg">
                        <form onSubmit={createQuestion}>
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-row justify-between">
                              <h1 className="text-5xl font-bold">
                                Create Question
                              </h1>
                              <button
                                className="text-3xl"
                                onClick={() => setQuestionModal("")}
                              >
                                <AiOutlineClose />
                              </button>
                            </div>

                            <div className="flex flex-row gap-5 h-1/2 justify-between w-full items-start">
                              <div className="flex items-center gap-5 w-full">
                                <div className="flex flex-col w-[90%]">
                                  <label
                                    htmlFor="question"
                                    className="block text-gray-700 font-bold text-3xl mb-3"
                                  >
                                    Question :{" "}
                                  </label>
                                  <input
                                    onChange={QuestionFormChangeHandle}
                                    value={questionData.question}
                                    type="text"
                                    name="question"
                                    id="question"
                                    className="w-full border-2 border-black text-3xl rounded-md
                                 py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center mr-5 w-[25%]">
                                <div className="flex flex-col">
                                  <label
                                    htmlFor="points"
                                    className="block text-gray-700 font-bold text-3xl mb-3"
                                  >
                                    Points :{" "}
                                  </label>
                                  <input
                                    type="number"
                                    onChange={QuestionFormChangeHandle}
                                    value={questionData.points}
                                    max={5}
                                    min={1}
                                    name="points"
                                    id="points"
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
                                    Options :{" "}
                                  </label>

                                  <label
                                    htmlFor="ins"
                                    onClick={instructionHandleQue}
                                    className="text-3xl bg-black w-[50px] h-[40px] text-md text-white flex justify-center 
                              border-black hover:border-black cursor-pointer rounded-2xl items-center border-2
                              hover:text-black hover:bg-white transition-all duration-200 ease-in-out hover:scale-110"
                                  >
                                    +
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
                              <div className="mx-auto my-auto mb-2">
                                <select
                                  name="answer"
                                  id="answer"
                                  onChange={QuestionFormChangeHandle}
                                  className="text-2xl border-black focus:border-blue-300 border-2 p-2 rounded w-[200px]"
                                  defaultValue={"Select"}
                                >
                                  <option value="Select">Select</option>
                                  {questionData.options.map(
                                    (opt: string, i: number) => (
                                      <option key={i}>{opt}</option>
                                    )
                                  )}
                                </select>
                              </div>
                            </div>

                            <div>
                              {questionData.options.map(
                                (ins: string, i: number) => (
                                  <div
                                    key={i}
                                    className="flex flex-row gap-5 mt-5 gap"
                                  >
                                    <div className="flex justify-center content-center items-center">
                                      <p className="text-2xl font-bold">
                                        {i + 1} :{" "}
                                      </p>
                                      <p className="text-2xl">{ins}</p>
                                      <div
                                        onClick={() => insRemoverQue(ins)}
                                        className="cursor-pointer text-2xl ml-2"
                                      >
                                        <AiOutlineClose />
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>

                            <div className="flex justify-center">
                              <button
                                type="submit"
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
                  </div>
                </>
              )}

              <div className="flex flex-col gap-6">
                <div className="mt-10 flex justify-end">
                  <button
                    onClick={() => setAssignmentModal(true)}
                    className="rounded-2xl bg-black w-[200px] h-[60px] text-xl text-white flex
                     justify-center items-center border-2 border-black hover:border-black cursor-pointer
                  hover:text-black hover:bg-white transition-all duration-200 ease-in-out hover:scale-110"
                  >
                    Add
                  </button>
                </div>

                <div className="w-[90%] mb-10">
                  {data?.assignment.map((ass: IAssignment, i: any) => (
                    <div key={i}>
                      <div
                        className="w-[100%] ml-4  text-3xl items-center bg-black mx-auto 
                          h-[50px] mt-5 rounded-[15px] text-white flex justify-between p-8
                          hover:scale-105 transition-all duration-200 ease-in-out"
                      >
                        <div className="flex">
                          <div
                            onClick={() => setQuestionModal(ass._id)}
                            className="cursor-pointer rounded-2xl bg-white p-2 m-2 text-black 
                        transition-all duration-100 ease-in-out hover:scale-105"
                          >
                            Add
                          </div>
                          <div
                            onClick={() => {
                              if (showQues === ass._id) setShowQues(false);
                              else setShowQues(ass._id);
                            }}
                            className="cursor-pointer rounded-2xl bg-white p-2 m-2 text-black 
                        transition-all duration-100 ease-in-out hover:scale-105"
                          >
                            Show
                          </div>
                        </div>
                        <p>Assignment No.{i + 1}</p>
                        <p>{ass.name}</p>
                        <p>Marks : {ass.maxscore}</p>
                        {ass?.questions?.length} Questions
                        <div
                          onClick={() => assignmentDelete(ass._id)}
                          className="cursor-pointer"
                        >
                          <MdDelete />
                        </div>
                      </div>

                      {showQues.toString() === ass._id.toString() && (
                        <>
                          {showQues.toString() === ass._id.toString() && (
                            <>
                              {ass.questions.length === 0 ? (
                                <div className="w-full text-3xl font-fold mx-auto text-center mt-5">
                                  No questions
                                </div>
                              ) : (
                                <div className="rounded-lg border-2 mt-6 w-[90%] border-black p-5 mx-auto">
                                  {ass.questions?.map(
                                    (question: IQuestion, i) => (
                                      <div key={i} className="w-full p-6 mt-2 mb-2 gap-7">
                                        <div className="flex justify-between flex-row ml-5 mr-5">
                                          <p className="text-3xl font-bold">
                                            {i + 1}.{question.question}
                                          </p>
                                          <div className="flex justify-center items-center">
                                            <p className="text-3xl font-bold">
                                              Points: {question.points}
                                            </p>
                                            <div
                                            onClick={() => questionDelete(ass._id , question?._id)}
                                            className="cursor-pointer text-3xl ml-4"
                                          >
                                            <MdDelete />
                                          </div>
                                          </div>
                                        </div>

                                        <div className="flex flex-col w-[90%] gap-3 mx-auto">
                                          {question.options.map(
                                            (opt, j) => (
                                              <div key={j}>
                                                <p className={`${opt === question?.answer ? 'text-green-500' : ''}
                                                text-2xl`}>{optArr[j]}. {opt}</p>
                                              </div>
                                            )
                                          )}
                                        </div>

                                        <div className="h-[1px] mt-4 bg-black w-[98%] mx-auto"></div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  ))}

                  {data?.assignment.length === 0 && (
                    <div className="text-4xl ml-7 text-center">
                      No assignments found 🧐
                    </div>
                  )}
                </div>
                

                <div className="w-full flex justify-center">
                  <button
                    onClick={publishQuizHandler}
                    className="mr-14 rounded-2xl bg-black w-[200px] h-[60px] text-xl text-white flex
                     justify-center items-center border-2 border-black hover:border-black cursor-pointer
                  hover:text-black hover:bg-white transition-all duration-200 ease-in-out hover:scale-110"
                  >
                    Publish
                  </button>
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
