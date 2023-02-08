import React, { useEffect, useState } from "react";
import { Box, Center, Text, Spinner } from "@chakra-ui/react";
import styles from "../../styles/circle.module.css";

import Intro from "../../utils/intro";

const Circles = (props) => {
  const { onClose } = props;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => initCircle(), 0);
  }, []);

  const initCircle = () => {
    const intro = new Intro(document.querySelector("#circles"));
    intro.start();
    setLoading(false);
  };

  console.log(styles);

  // if (loading) return <Spinner />
  return (
    <Box pos="relative" visibility={loading ? "hidden" : "visible"}>
      <Center>
        <svg
          id="circles"
          className={styles.circles}
          width="100%"
          height="100%"
          viewBox="0 0 1400 1400"
        >
          <def>
            <path
              id="circle-1"
              d="M250,700.5A450.5,450.5 0 1 11151,700.5A450.5,450.5 0 1 1250,700.5"
            ></path>
            <path
              id="circle-2"
              d="M382,700.5A318.5,318.5 0 1 11019,700.5A318.5,318.5 0 1 1382,700.5"
            ></path>
            <path
              id="circle-3"
              d="M487,700.5A213.5,213.5 0 1 1914,700.5A213.5,213.5 0 1 1487,700.5"
            ></path>
            <path
              id="circle-4"
              d="M567.5,700.5A133,133 0 1 1833.5,700.5A133,133 0 1 1567.5,700.5"
            ></path>
          </def>
          <text
            className={`circlesText ${styles.circlesText} ${styles.circlesText1}`}
          >
            <textPath
              className="circlesText-path"
              xlinkHref="#circle-1"
              aria-label=""
              textLength="2830"
            >
              And now this tree of ours may grow&nbsp;
            </textPath>
          </text>
          <text
            className={`circlesText ${styles.circlesText} ${styles.circlesText2}`}
          >
            <textPath
              className="circlesText-path"
              xlinkHref="#circle-2"
              aria-label=""
              textLength="2001"
            >
              Depth over distance every time&nbsp;
            </textPath>
          </text>
          <text
            className={`circlesText ${styles.circlesText} ${styles.circlesText3}`}
          >
            <textPath
              className="circlesText-path"
              xlinkHref="#circle-3"
              aria-label=""
              textLength="1341"
            >
              domain Own &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
            </textPath>
            <textPath
              className={`circlesText-path ${styles.highlight}`}
              xlinkHref="#circle-3"
              aria-label=""
              textLength="1341"
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              your &nbsp;
            </textPath>
          </text>
          <text
            className={`circlesText ${styles.circlesText} ${styles.circlesText4}`}
          >
            <textPath
              className="circlesText-path"
              xlinkHref="#circle-4"
              aria-label=""
              textLength="836"
            >
              Depth over distance was all I asked of you&nbsp;
            </textPath>
          </text>
        </svg>
      </Center>
      <Center position="absolute" width="100vw" height="100vh">
        <button id="enter" className={styles.enter} onClick={() => onClose()}>
          <div id="enterBg"></div>
          <span id="enterText">Enter</span>
        </button>
      </Center>
    </Box>
  );
};

export default Circles;
