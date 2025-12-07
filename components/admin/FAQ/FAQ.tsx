"use client";

import AdminAuthContext from "@/app/admin/context/AuthContext";
import React, { useState, useEffect, useContext } from "react";
import { HiMinus, HiPlus, HiTrash } from "react-icons/hi";

type Question = {
  id: string;
  question: string;
  answer: string;
};

type APIQuestion = {
  id: string;
  question: string;
  answer: string;
};

const FAQ: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newAnswer, setNewAnswer] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authTokens } = useContext(AdminAuthContext) || {};

  useEffect(() => {
    const fetchFAQs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/admin/faqs/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access_token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch FAQs");
        }

        const data: APIQuestion[] = await response.json();
        setQuestions(data);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("Failed to load FAQs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (authTokens) {
      fetchFAQs();
    }
  }, [authTokens]);

  const toggleQuestion = (id: string) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/admin/faqs/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify({
            question: newQuestion,
            answer: newAnswer,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add FAQ");
      }

      const newFaq: APIQuestion = await response.json();
      setQuestions([...questions, newFaq]);
      setNewQuestion("");
      setNewAnswer("");
    } catch (err) {
      console.error("Error adding FAQ:", err);
      setError("Failed to add FAQ. Please try again.");
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/admin/faqs/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete FAQ");
      }

      setQuestions(questions.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Error deleting FAQ:", err);
      setError("Failed to delete FAQ. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center bg-gradient-to-b from-gray-100 to-white py-8 mt-10">
      <h1 className="text-4xl font-extrabold text-center mb-4 text-blue-600">
        Frequently Asked Questions
      </h1>
      <p className="text-center text-lg text-gray-700 mb-8 px-4 md:px-0">
        Manage your FAQ section here. Add, remove, or view questions and
        answers.
      </p>

      <div className="w-[90%] 800px:w-[80%] m-auto mb-8">
        <dl className="space-y-6">
          {questions.map((q) => (
            <div
              key={q.id}
              className={`border rounded-lg shadow-lg p-4 transition-transform duration-300 ease-in-out transform ${
                activeQuestion === q.id
                  ? "bg-blue-50 scale-105"
                  : "hover:shadow-2xl"
              }`}
            >
              <dt className="text-lg">
                <div className="flex items-center justify-between">
                  <button
                    className="flex-1 flex items-center justify-between text-left focus:outline-none"
                    onClick={() => toggleQuestion(q.id)}
                  >
                    <span className="font-semibold text-gray-800">
                      {q.question}
                    </span>
                    <span className="ml-6 flex-shrink-0">
                      {activeQuestion === q.id ? (
                        <HiMinus className="h-6 w-6 text-blue-600" />
                      ) : (
                        <HiPlus className="h-6 w-6 text-blue-600" />
                      )}
                    </span>
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="ml-4 p-2 text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <HiTrash className="h-5 w-5" />
                  </button>
                </div>
              </dt>
              {activeQuestion === q.id && (
                <dd className="mt-2 pr-12">
                  <p className="text-base text-gray-700">{q.answer}</p>
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>

      <div className="w-[90%] 800px:w-[80%] m-auto p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Add a Question
        </h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <textarea
            placeholder="Answer"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
          />
        </div>
        <button
          onClick={handleAddQuestion}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Add Question
        </button>
      </div>
    </div>
  );
}; 

export default FAQ;
