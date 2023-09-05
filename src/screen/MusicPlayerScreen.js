/* eslint-disable jsx-a11y/no-distracting-elements */
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	dropDownIcon,
	musicNextIcon,
	musicPauseIcon,
	musicPlayIcon,
	musicPrevIcon,
} from "../assets/iconIndex";
import LoadingScreen from "./LoadingScreen";
import styles from "./MusicPlayerScreen.module.css";
import { songs } from "./data";

const MusicPlayerScreen = () => {
	const containerDeg = useRef(0);
	const scrollStop = useRef(0);
	const [navigate, setNavigate] = useState(false);
	const [songIndex, setSongIndex] = useState(0);
	const [musicPlayerContainer, getMusicPlayerContainer] = useState();
	const [musicMarqueeTitle, getMusicMarqueeTitle] = useState();
	const [musicSongElement, getMusicSongElement] = useState();
	const [clickSoundEffect, getClickSoundEffect] = useState();
	const [colorChange, getColorChange] = useState();
	const [initiateBackgroundColor, setInitiateBackgroundColor] = useState();
	const [stickyProgress, getStickyProgress] = useState();
	const [initiateColor, setInitiateColor] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [song, setSong] = useState(songs[0]);
	const [progressBar, getProgressBar] = useState();
	useEffect(() => {
		getMusicPlayerContainer(document.getElementById("music_player__container"));
		getMusicMarqueeTitle(document.getElementById("marquee_music_title"));
		getMusicSongElement(document.getElementById("music"));
		getClickSoundEffect(document.getElementById("click_effect"));
		getColorChange(document.getElementById("color_change"));
		getProgressBar(document.getElementById("time_bar"));
		getStickyProgress(document.getElementById("sticky_progress"));
	});

	const scrollMusic = useCallback(() => {
		let scrollY = window.scrollY;
		if (!musicPlayerContainer) return;
		if (scrollY >= scrollStop.current) {
			containerDeg.current += 2.5;
		}
		if (scrollY < scrollStop.current) {
			containerDeg.current -= 3.5;
		}
		musicPlayerContainer.style.transform = `rotate(${containerDeg.current}deg)`;
		scrollStop.current = scrollY;
	}, [musicPlayerContainer]);

	useEffect(() => {
		window.addEventListener("scroll", scrollMusic);
		return () => {
			window.removeEventListener("scroll", scrollMusic);
		};
	});

	const [musicPlayState, setMusicPlayState] = useState(true);
	useEffect(() => {
		if (!musicSongElement) return;
		if (!musicMarqueeTitle) return;
		if (musicPlayState) {
			musicSongElement.play();
			musicMarqueeTitle.start();
		} else {
			musicSongElement.pause();
			musicMarqueeTitle.stop();
		}
	}, [musicPlayState]);
	const handleMusicPlay = () => {
		setMusicPlayState(true);
	};
	const handleMusicPause = () => {
		setMusicPlayState(false);
	};
	const handleMusicEnd = () => {
		if (songIndex === songs.length - 1) {
			setMusicPlayState(false);
			return;
		}
		setSongIndex(() => songIndex + 1);
	};
	const handlePrevClick = () => {
		if (songIndex === 0) return;
		setSongIndex(() => songIndex - 1);
		setMusicPlayState(true);
	};
	const handleNextClick = () => {
		if (songIndex === songs.length - 1) return;
		setSongIndex(() => songIndex + 1);
		setMusicPlayState(true);
	};
	const soundEffect = () => {
		if (clickSoundEffect.paused) {
			clickSoundEffect.play();
		} else {
			clickSoundEffect.currentTime = 0;
		}
	};
	useEffect(() => {
		setSong(() => songs[songIndex]);
	}, [songIndex]);

	useEffect(() => {
		const loading = setTimeout(() => {
			setIsLoading(false);
		}, 5000);
		return () => {
			clearTimeout(loading);
		};
	}, []);

	const height = window.screen.height;
	const changeColor = useCallback(() => {
		if (colorChange?.getBoundingClientRect().top <= height) {
			setSong({
				...song,
				backgroundColor: initiateColor,
				textColor: initiateBackgroundColor,
			});
		} else {
			setSong({
				...song,
				backgroundColor: initiateBackgroundColor,
				textColor: initiateColor,
			});
		}
	}, [colorChange, height, initiateBackgroundColor, initiateColor, song]);
	useEffect(() => {
		window.addEventListener("scroll", changeColor);
		return () => {
			window.removeEventListener("scroll", changeColor);
		};
	}, [changeColor]);
	useEffect(() => {
		if (!song) return;
		setInitiateBackgroundColor(song.backgroundColor);
		setInitiateColor(song.textColor);
		console.log(initiateBackgroundColor, initiateColor);
	}, [song.url]);
	useEffect(() => {
		if (!musicSongElement) return;
		const timeBar = document.getElementById("time_bar");
		const time = setInterval(() => {
			const currentTime = musicSongElement.currentTime;
			const duration = musicSongElement.duration;
			if (!timeBar) return;
			timeBar.style.minWidth = (currentTime / duration) * 100 + "%";
		}, 1000);
		return () => {
			clearInterval(time);
		};
	}, [musicSongElement]);
	const width = window.innerWidth;
	const handleProgressTime = (event) => {
		console.log(event.clientX, width);
		musicSongElement.currentTime =
			(event.clientX / width) * musicSongElement.duration;
		progressBar.style.minWidth = (event.clientX / width) * 100 + "%";
	};
	const progressBarSticky = useCallback(() => {
		if (!stickyProgress) return;
		var clientY = document.documentElement.scrollTop;
		console.log(clientY);
		console.log(window.innerHeight);
		if (clientY >= window.innerHeight) {
			stickyProgress.style.transform = "translateY(0)";
		} else {
			stickyProgress.style.transform = "translateY(74px)";
		}
	}, [stickyProgress]);
	useEffect(() => {
		window.addEventListener("scroll", progressBarSticky);
		return () => {
			window.removeEventListener("scroll", progressBarSticky);
		};
	}, [progressBarSticky]);

	return (
		<>
			<LoadingScreen
				loading={isLoading}
				join={() => setNavigate(true)}
				navigate={navigate}
			/>

			{navigate && (
				<>
					<audio
						autoPlay
						onEnded={handleMusicEnd}
						controls
						src={song.url}
						className="hidden"
						id="music"
					></audio>
					<div
						className={styles.music_app}
						style={{ background: song.backgroundColor, color: song.textColor }}
					>
						{/* <div className={styles.music_app_mask}></div> */}
						<div className={styles.header_container}>
							<span className={styles.signature}>phuckh17ng</span>
							<div className={styles.music_title_header}>
								<div className={styles.music_player_control}>
									<span onClick={handlePrevClick}>
										{musicPrevIcon(
											`${styles.music_prev_icon} text-[${song.textColor}]`
										)}
									</span>

									<div
										className={styles.music_play_btn}
										style={{ borderColor: song.textColor }}
									>
										<span
											className={
												musicPlayState ? "hidden" : "flex w-full h-full"
											}
											onClick={handleMusicPlay}
										>
											{musicPlayIcon(
												`${styles.music_play_icon} text-[${song.textColor}]`
											)}
										</span>
										<span
											className={
												musicPlayState ? "flex w-full h-full" : "hidden"
											}
											onClick={handleMusicPause}
										>
											{musicPauseIcon(
												`${styles.music_pause_icon} text-[${song.textColor}]`
											)}
										</span>
									</div>

									<span className="w-fit h-fit" onClick={handleNextClick}>
										{musicNextIcon(
											`${styles.music_next_icon} text-[${song.textColor}]`
										)}
									</span>
								</div>

								<div className={styles.title_container}>
									<div className={styles.music_count}>
										<span>(</span>
										{songIndex + 1}/{songs.length}
										<span>)</span>
									</div>
									<div className={styles.title_mask_container}>
										<marquee scrollamount={5} id="marquee_music_title">
											{song.title}
										</marquee>
									</div>
								</div>
								<div>
									{dropDownIcon(
										`${styles.drop_down_icon} text-[${song.textColor}]`
									)}
								</div>
							</div>
						</div>
						<div className={styles.app_container}>
							<div className={styles.music_container}>
								<div className="relative">
									<img
										src={song.backgroundImage}
										className={styles.music_bg__mask}
										alt="mask"
									/>
									{/* <img
										src={song.backgroundImage}
										className={styles.music_bg__mask_1}
										alt="mask"
									/> */}
								</div>

								<div
									className={styles.music_player_container}
									id="music_player__container"
								>
									<div className={styles.app_logo} id="music_player">
										{/* <div></div> */}
										<img
											src={song.subTextImage}
											alt="album_text"
											className={styles.music_album_text}
										/>
										<img
											src={song.backgroundImage}
											alt="logo"
											className={styles.music_disk}
										/>
									</div>
								</div>
							</div>
							<div className={styles.author}>
								<span className="font-extrabold">(IMAGE CREDIT)</span>
								<span className="ml-1">BASIC/DEPT®</span>
							</div>
						</div>
						<div
							className={styles.infomation_container}
							style={{ borderColor: song.textColor }}
							id="curated"
						>
							<div className="flex items-end justify-between">
								<span className="text-9xl font-extrabold tracking-tighter">
									Curated by
								</span>
								<span className="text-end">
									<div className="text-sm font-extrabold leading-3">
										(38 tracks)
									</div>
									<div>4Hrs 5mins</div>
								</span>
							</div>
							<div className="text-9xl font-extrabold text-end">phuckh17ng</div>
						</div>
						<blockquote className={styles.quote_block}>
							<div className="text-base font-normal absolute top-16 left-2">
								<div className="font-bold">(-)</div>
								<div className="uppercase">phuckh17ng</div>
							</div>
							<div className={styles.quote}>
								“I realized that I was getting so frustrated with myself because
								I was subconsciously living in the future of where I thought I
								should be and not actually worrying about what it takes to truly
								get there. Once I stopped living there and fully embraced my
								journey, which is essentially the best part, my level of
								production and creativity completely changed.”
							</div>
						</blockquote>
						<div className={styles.song_list_container}>
							<audio
								controls
								src={require("../assets/sound/clickSoundEffect.wav")}
								className="hidden"
								id="click_effect"
							></audio>
							<div className={styles.song_list_subtitle} id="color_change">
								<div className="col-span-4">Artist</div>
								<div className="col-span-6">Track</div>
							</div>
							{songs.map((song, songIndex) => {
								return (
									<div
										className={styles.song_list_grid}
										key={songIndex}
										onMouseEnter={soundEffect}
										onClick={() => {
											setSong(song);
											setSongIndex(songIndex);
										}}
									>
										<div className="col-span-4">{song.author}</div>
										<div className="col-span-6">{song.title}</div>
										<div className="col-span-2 w-fit invisible right-0 top-[-88px] absolute">
											<img
												className="object-cover"
												width={200}
												height={200}
												src={song.backgroundImage}
												alt={song.title}
											></img>
										</div>
									</div>
								);
							})}
						</div>
					</div>
					<div
						className={styles.sticky_progress_bar}
						id="sticky_progress"
						style={{ background: song.backgroundColor, color: song.textColor }}
					>
						<div className={styles.header_container}>
							<div className="flex items-center w-[450px] justify-between py-6">
								<div className={styles.music_player_control}>
									<span onClick={handlePrevClick}>
										{musicPrevIcon(
											`${styles.music_prev_icon} text-[${song.textColor}]`
										)}
									</span>

									<div
										className={styles.music_play_btn}
										style={{ borderColor: song.textColor }}
									>
										<span
											className={
												musicPlayState ? "hidden" : "flex w-full h-full"
											}
											onClick={handleMusicPlay}
										>
											{musicPlayIcon(
												`${styles.music_play_icon} text-[${song.textColor}]`
											)}
										</span>
										<span
											className={
												musicPlayState ? "flex w-full h-full" : "hidden"
											}
											onClick={handleMusicPause}
										>
											{musicPauseIcon(
												`${styles.music_pause_icon} text-[${song.textColor}]`
											)}
										</span>
									</div>

									<span className="w-fit h-fit" onClick={handleNextClick}>
										{musicNextIcon(
											`${styles.music_next_icon} text-[${song.textColor}]`
										)}
									</span>
								</div>

								<div className={styles.title_container}>
									<div className={styles.music_count}>
										<span>(</span>
										{songIndex + 1}/{songs.length}
										<span>)</span>
									</div>
									<div className={styles.title_mask_container}>
										<marquee scrollamount={5} id="marquee_music_title">
											{song.title}
										</marquee>
									</div>
								</div>
								<div>
									{dropDownIcon(
										`${styles.drop_down_icon} text-[${song.textColor}]`
									)}
								</div>
							</div>
						</div>
					</div>
					<div
						className="min-w-full h-1 fixed bottom-0 left-0 cursor-pointer z-50"
						onClick={handleProgressTime}
					>
						<div
							id="time_bar"
							className={styles.time_bar}
							style={{ background: song.textColor }}
						></div>
					</div>
				</>
			)}
		</>
	);
};

export default MusicPlayerScreen;
