import React from "react";
import SkeletonLoader from "./SkeletonLoader";

function SkeltonLoaderSet() {
  return (
    <div className="md:w-8/12 mx-2 md:mx-auto mt-12">
      <SkeletonLoader width="20%" height=".5rem" count={1} />
      <SkeletonLoader width="40%" height=".5rem" count={1} />
      <SkeletonLoader width="60%" height=".5rem" count={1} />
      <SkeletonLoader width="80%" height=".5rem" count={1} />
      <SkeletonLoader width="100%" height=".5rem" count={1} />
    </div>
  );
}

export default SkeltonLoaderSet;
