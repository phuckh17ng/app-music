import React from "react";
import styles from "./LoadingScreen.module.css";

const LoadingScreen = ({ loading, join, navigate }) => {
  console.log(navigate);
  return (
    <div
      className={`${
        !navigate
          ? styles.loading_container
          : styles.loading_container_navigation
      } w-[100vw] h-[100vh] flex justify-center items-center`}
    >
      <div className="h-1/2 w-1/4 flex items-center justify-center flex-col z-10 overflow-hidden">
        <div
          className={`${styles.logo} ${
            !loading
              ? "!-translate-y-48 opacity-0"
              : "!translate-y-12 opacity-100"
          }`}
        >
          phuckh17ng
        </div>
        <div
          onClick={join}
          className={`${
            styles.join
          } cursor-pointer transition-transform opacity-0 delay-500 duration-1000 border-2 rounded-full w-24 h-24 flex justify-center items-center border-black translate-y-56 ${
            !loading && "!-translate-y-6 !opacity-100"
          }`}
        >
          <span className={styles.button}>Join!</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
