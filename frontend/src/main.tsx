import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import NoteList from "./components/Notes/NoteList.tsx";
import SubjectList from "./components/Subjects/SubjectList.tsx";
import LoginCard from "./components/Auth/LoginCard.tsx";
import RegisterCard from "./components/Auth/RegisterCard.tsx";
import Dashboard from "./components/Dashboard.tsx";
import NoteDetails from "./components/Notes/NoteDetails.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/subjects",
        element: <SubjectList />,
      },
      {
        path: "/subject/:id/notes",
        element: <NoteList />,
      },
      {
        path: "/login",
        element: <LoginCard />,
      },
      {
        path: "/register",
        element: <RegisterCard />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/subject/:id/notes/:noteId",
        element: <NoteDetails />,
      },
      {
        path: "/dashboard/:noteId",
        element: <NoteDetails />,
      },
      {
        path: "/note/:noteId",
        element: <NoteDetails />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
