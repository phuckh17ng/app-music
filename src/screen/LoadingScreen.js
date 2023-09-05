import React, { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";

const LoadingScreen = ({ loading, join, navigate }) => {
	console.log(navigate);
	const [styleLogo, getStyleLogo] = useState({});
	useEffect(() => {
		if (!loading) {
			getStyleLogo({
				animationName: "unset",
				opacity: 1,
			});
		}
	}, [loading]);
	return (
		<div
			className={`${
				!navigate
					? styles.loading_container
					: styles.loading_container_navigation
			} w-[100vw] h-[100vh] flex justify-center items-center fixed`}
		>
			<div
				className={`${
					navigate && "!opacity-0"
				} w-1/4 flex items-center justify-center h-1/2 flex-col z-10 overflow-hidden opacity-100 transition-all duration-300 ease-in-out`}
			>
				<div
					className={`${styles.logo} ${
						loading ? "translate-y-6" : "translate-y-0"
					}`}
					style={styleLogo}
				>
					phuckh17ng
				</div>
				<div
					onClick={join}
					className={`${styles.join} ${
						loading
							? "opacity-0 translate-y-6 invisible"
							: "visible opacity-100 translate-y-0"
					} cursor-pointer border-2 rounded-3xl px-9 py-1 flex justify-center items-center border-black`}
				>
					<span className={styles.button}>Join!</span>
				</div>
			</div>
		</div>
	);
};

export default LoadingScreen;
