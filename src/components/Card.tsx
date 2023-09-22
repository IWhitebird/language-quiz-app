
import { IQuiz } from "../types"

const Card = ({quiz} : {quiz : IQuiz}) => {
    console.log("myquiz" , quiz)
  return (
    <div className="border-1 border-black border w-[300px] h-[300px]">
        <img src={quiz.image} className="w-[100%] h-[40%] mx-auto" alt="img"/>

        <div className="w-[90%] mx-auto">
          <h1 className="text-2xl font-bold">{quiz.name}</h1>
          <h2 className="text-xl">{quiz.description}</h2>
          <h3>Langauge : {quiz.language}</h3>
          <h3 className="text-end">{quiz.createdBy.username}</h3>
        </div>
    </div>
  )
}

export default Card