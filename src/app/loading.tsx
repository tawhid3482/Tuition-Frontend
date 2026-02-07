import Image from "next/image";
import React from "react";

const loading = () => {
  return (
    <div className="w-64 mx-auto ">
      <Image
        src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif"
        width={200}
        height={200}
        alt="loading"
        className="w-96 mx-auto mt-20"
      />
    </div>
  );
};

export default loading;
