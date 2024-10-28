import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import NoteList from "./components/Notes/NoteList.tsx";
import SubjectList from "./components/Subjects/SubjectList.tsx";
import LoginCard from "./components/Auth/LoginCard.tsx";
import RegisterCard from "./components/Auth/RegisterCard.tsx";

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
