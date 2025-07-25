import { useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();
  console.log(error);
  return (
    <div>
      <div className="flex min-h-screen items-center justify-center">
        ErrorPage
      </div>
    </div>
  );
};

export default ErrorPage;
