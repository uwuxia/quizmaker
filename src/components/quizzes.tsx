import React from "react";
import { Link } from "react-router-dom";

interface QuizzesStateTypes {
  quizzes: {
    questions: {
      question: string;
      correctAnswer: string;
      choices: string[];
    }[][];
    totalQuestions: number;
    name: string;
    id: string;
  }[];
  isLoading: boolean;
}

class Quizzes extends React.Component<{}, QuizzesStateTypes> {
  state = {
    quizzes: [],
    isLoading: true,
  };

  async componentDidMount() {
    const data = await fetch("/quizzes");
    const response = await data.json();

    this.setState({
      isLoading: false,
      quizzes: response,
    });

    document.addEventListener('keypress', (e) => {
      if (e.key === '/') {
        setTimeout(() => document.getElementById('search')?.focus(), 0);
      }
    })
  }

  render() {
    return (
      <div className="quizzes">
        <input
          type="text"
          id="search"
          placeholder="search..."
          autoComplete="off"
          onChange={(e) => {
            if (e.target.value === '') {
              (async () => {
                const data = await fetch("/quizzes");
                const response = await data.json();
        
                this.setState({
                  quizzes: response,
                });
              })();
            } else {
              this.setState({
                quizzes: this.state.quizzes.filter((quiz: any) =>
                  quiz.name.includes(e.target.value)
                ),
              });
            }
          }}
        />
        {this.state.isLoading ? (
          <p>Loading...</p>
        ) : this.state.quizzes.length >= 1 ? (
          this.state.quizzes.map((quiz: any) => (
            <div className="quiz">
              <h2>{quiz.name}</h2>
              <Link to={`/q/${quiz.id}`}>Take Quiz</Link>
            </div>
          ))
        ) : (
          <p>404 not found.</p>
        )}
      </div>
    );
  }
}

export default Quizzes;
