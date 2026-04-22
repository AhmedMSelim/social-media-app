import React from "react";
import { Circles } from 'react-loader-spinner';

export default function Loader() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Circles
        height="80"
        width="80"
        color="#09c"
        ariaLabel="circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
}
