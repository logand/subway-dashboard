import React from "react";

const NoLocationIcon = ({ className, styles }) => {
  return (
    <i className="icon">
      <svg
        className={`noLocationArrow ${className}`}
        style={styles}
        fill="#868e96"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M20.94 11c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06c-1.13.12-2.19.46-3.16.97l1.5 1.5C10.16 5.19 11.06 5 12 5c3.87 0 7 3.13 7 7 0 .94-.19 1.84-.52 2.65l1.5 1.5c.5-.96.84-2.02.97-3.15H23v-2h-2.06zM3 4.27l2.04 2.04C3.97 7.62 3.25 9.23 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c1.77-.2 3.38-.91 4.69-1.98L19.73 21 21 19.73 4.27 3 3 4.27zm13.27 13.27C15.09 18.45 13.61 19 12 19c-3.87 0-7-3.13-7-7 0-1.61.55-3.09 1.46-4.27l9.81 9.81z" />
      </svg>
    </i>
  );
};

const FindingLocationIcon = ({ className, styles }) => {
  return (
    <i className="icon">
      <svg
        className={`findingLocationArrow ${className}`}
        style={styles}
        fill="#000000"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M20.94 11c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
      </svg>
    </i>
  );
};

const HasLocationIcon = ({ className, styles }) => {
  return (
    <i className="icon">
      <svg
        className={`hasLocationArrow ${className}`}
        style={styles}
        fill="#000000"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
      </svg>
    </i>
  );
};

const IconDirectionArrow = ({ className, styles }) => {
  return (
    <i className="icon">
      <svg
        className={className}
        style={styles}
        fill="#ffffff"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <path d="M12 8V4l8 8-8 8v-4H4V8z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    </i>
  );
};

const IconPlayArrow = ({ className, styles }) => {
  return (
    <i className="icon">
      <svg
        className={`playArrowIcon ${className}`}
        style={styles}
        fill="#000000"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <path d="M8 5v14l11-7z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    </i>
  );
};

export {
  NoLocationIcon,
  HasLocationIcon,
  FindingLocationIcon,
  IconPlayArrow,
  IconDirectionArrow
};
