"use client";
import React, { useEffect, useState } from "react";
import { FaRegCircleDot } from "react-icons/fa6";
import { IoMdTrendingUp } from "react-icons/io";
import { fetchProjectsService } from "@services/projects";
import Loader from "src/common/Loader";
import { Project, query } from "../../types/global";
import Link from "next/link";
import SkeltonLoaderSet from "@common/SkeltonLoaderSet";
import InputBox from "@common/InputBox";
import { motion } from "framer-motion";
import { useDebounce } from "@hooks/useDebounce ";
import useScroll from "@hooks/useScroll ";

const smileyFace = "https://www.svgrepo.com/show/526258/smile-square.svg";
const cryingFace = "https://www.svgrepo.com/show/528574/sad-square.svg";

const Projects: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [filterSearch, setFilterSearch] = useState<string>("");
  const debouncedFilterSearch = useDebounce(filterSearch, 500);
  const [searchNoResults, setSearchNoResults] = useState<boolean>(false);

  const loadMoreProjects = () => setPage((prevPage) => prevPage + 1);
  const containerRef = useScroll({
    loading,
    hasMore,
    onLoadMore: loadMoreProjects,
  });

  useEffect(() => {
    setProjects([]);
    setPage(1);
    setHasMore(true);
    fetchProjects(1);
  }, [debouncedFilterSearch]);

  useEffect(() => {
    if (page > 1) {
      fetchProjects(page);
    }
  }, [page]);

  const fetchProjects = async (page: number) => {
    setLoading(true);
    const limit = 10;
    const skip = page - 1;
    const params: query = { limit, skip };
    if (debouncedFilterSearch) {
      params.token = debouncedFilterSearch;
    }

    try {
      const response = await fetchProjectsService(params);
      const { projects, projectCount } = response.data;
      setTotalProjects(projectCount);
      if (projects.length === 0) {
        if (debouncedFilterSearch) {
          setSearchNoResults(true);
        } else {
          setHasMore(false);
        }
      } else {
        setProjects((prevProjects) => [...prevProjects, ...projects]);
        setSearchNoResults(false);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && projects.length === 0 ? (
        <SkeltonLoaderSet />
      ) : (
        <div>
          <div className="flex justify-end container mx-auto w-8/12">
            <InputBox
              className="pl-8 pr-4 py-1 px-3"
              id=""
              type="text"
              placeholder="Search..."
              value={filterSearch}
              bgColor="bg-secondary"
              onChange={(e) => setFilterSearch(e.target.value)}
            />
          </div>
          {searchNoResults ? (
            <motion.div
              className="flex justify-center items-center h-[35rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="items-center flex flex-col justify-center">
                <motion.img
                  src={cryingFace}
                  alt="No data found"
                  className="w-24 h-24"
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 1,
                    ease: "easeInOut",
                  }}
                />
                <p className="text-gray-500">
                  Seems like there are no project to show
                </p>
              </div>
            </motion.div>
          ) : !loading && !hasMore && projects.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-items-center md:w-8/12 mx-2 md:mx-auto">
              <div className="flex flex-col justify-center items-center bg-gray-900 w-full rounded-3xl p-5">
                <img
                  src="https://www.svgrepo.com/show/527587/add-square.svg"
                  alt="No data"
                  className="w-32 h-32 mx-auto mt-20"
                />
                <p className="text-gray-400 mt-2">Add a project</p>
              </div>
              <div className="flex flex-col justify-center items-center bg-gray-900 w-full rounded-3xl p-5">
                <img
                  src="https://www.svgrepo.com/show/527627/box.svg"
                  alt="No data"
                  className="w-32 h-32 mx-auto mt-20"
                />
                <p className="text-gray-400 mt-2">View Documentation</p>
              </div>
            </div>
          ) : (
            <div>
              <motion.div
                ref={containerRef}
                className="h-[34rem] md:w-8/12 mx-2 md:mx-auto gap-5 justify-items-center overflow-y-auto hide-scrollbar mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="w-full p-2 bg-bgBlack shadow-md shadow-black rounded-xl border-gray-800 border mb-3 "
                  >
                    <div className="flex gap-3 items-center text-center border-b-2 pb-3 border-neutral-500">
                      <FaRegCircleDot className="text-gray-400" />
                      <p className="text-[.6rem] md:text-sm text-gray-400 hover:text-white">
                        {project.tokenAddress}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <Link
                        href={`batchswap/${project.tokenAddress}`}
                        prefetch={true}
                        className="bg-cyan hover:bg-cyanDark shadow-md shadow-black border-gray-800  flex justify-between p-1 rounded-full mt-2 text-sm gap-2"
                      >
                        <IoMdTrendingUp className="text-xl" /> Batch Swap
                      </Link>
                    </div>
                  </div>
                ))}
              </motion.div>
              <div>
                {loading && hasMore && (
                  <div className="flex justify-center items-center w-8/12 mx-auto">
                    <Loader strokeWidth="2" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Projects;
