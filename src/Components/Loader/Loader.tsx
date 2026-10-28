import { RotatingLines } from "react-loader-spinner";

export default function Loader() {
  return (
    <>
      <div className="absolute w-full h-screen flex justify-center items-center">
        <RotatingLines
          visible={true}
          height="80"
          width="80"
          color="blue"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    </>
  );
}
