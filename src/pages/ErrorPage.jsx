import { useRouteError } from "react-router";
import Header from "../components/Header";

const ErrorPage = () => {
  const error = useRouteError();
  console.log(error);
  return (
    <div>
      <Header></Header>
      <div className="flex min-h-screen items-center justify-center">
        ErrorPage
      </div>
    </div>
  );
};

export default ErrorPage;
