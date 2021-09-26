import React from "react";
import { withRouter } from "react-router";
import NotFound from "./404";

interface StateTypes {
  quiz: {
    questions: {
      question: string;
      correctAnswer: string;
      choices: string[];
    }[];
    id: string;
    totalQuestions: number;
  };
  isLoading: boolean;
  is404: boolean;
  finished: boolean;
  result: number;
  currentQuestion: number;
}

class Quiz extends React.Component<any, StateTypes> {
  state = {
    quiz: {
      questions: [
        {
          question: "",
          correctAnswer: "",
          choices: ["", "", "", ""],
          index: 1,
        },
      ],
      id: "",
      totalQuestions: 1,
    },
    is404: false,
    isLoading: true,
    finished: false,
    result: 0,
    currentQuestion: 0,
  };

  resetQuiz = () => {
    this.setState({
      finished: false,
      result: 0,
      currentQuestion: 0,
    });
  };

  handleAnswer = (e: any) => {
    const answer = e.target.getAttribute("data-choice");

    if (
      answer ===
      this.state.quiz.questions[this.state.currentQuestion].correctAnswer
    ) {
      this.setState({
        result: this.state.result + 1,
      });
    }

    if (this.state.currentQuestion + 1 >= this.state.quiz.totalQuestions) {
      this.setState({
        finished: true,
      });

      console.log(this.state.quiz.totalQuestions);
    } else {
      this.setState({
        currentQuestion: this.state.currentQuestion + 1,
      });
    }
  };

  async componentDidMount() {
    try {
      const data = await fetch(`/quiz/${this.props.match.params.id}`);
      const response = await data.json();

      this.setState({
        quiz: response,
        isLoading: false,
      });
    } catch (err) {
      console.log(err);
      this.setState({ is404: true, isLoading: false });
    }

    console.log(this.state);
  }

  render() {
    return (
      <div className="quiz">
        {this.state.isLoading ? (
          <p>Loading...</p>
        ) : !this.state.is404 ? (
          <div className="quiz-container">
            {this.state.finished ? (
              <div className="results">
                <h2>
                  You scored {this.state.result} out of{" "}
                  {this.state.quiz.totalQuestions}
                </h2>
                <button onClick={this.resetQuiz}>Reset quiz</button>
              </div>
            ) : (
              <>
                <div className="question">
                  <h2>
                    Question {this.state.currentQuestion + 1}/
                    {this.state.quiz.questions.length}
                  </h2>
                  <p>
                    {
                      this.state.quiz.questions[this.state.currentQuestion]
                        .question
                    }
                  </p>
                </div>
                <div className="answers">
                  {this.state.quiz.questions[
                    this.state.currentQuestion
                  ].choices.map((choice) => (
                    <div className="choice">
                      <button onClick={this.handleAnswer} data-choice={choice}>
                        {choice}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <NotFound />
        )}
      </div>
    );
  }
}

export default withRouter(Quiz);