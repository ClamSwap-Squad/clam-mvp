import React from "react";

const IMG_LOC = "/stock/";

const TEAM = [
  { img: IMG_LOC + "1.jpg", name: "John Smith", designation: "Founder", discord: "@handle" },
  { img: IMG_LOC + "2.jpg", name: "John Smith", designation: "Founder", discord: "@handle" },
  { img: IMG_LOC + "3.jpg", name: "John Smith", designation: "Founder", discord: "@handle" },
  { img: IMG_LOC + "4.jpg", name: "John Smith", designation: "Founder", discord: "@handle" },
  { img: IMG_LOC + "5.jpg", name: "John Smith", designation: "Founder", discord: "@handle" },
  { img: IMG_LOC + "6.jpg", name: "John Smith", designation: "Founder", discord: "@handle" },
  { img: IMG_LOC + "7.jpg", name: "John Smith", designation: "Founder", discord: "@handle" },
  { img: IMG_LOC + "8.jpg", name: "John Smith", designation: "Founder", discord: "@handle" },
];

const ADVISORS = [
  { img: IMG_LOC + "6.jpg", name: "John Smith", designation: "Founder", discord: "@handle" },
  { img: IMG_LOC + "4.jpg", name: "John Smith", designation: "Founder", discord: "@handle" },
  { img: IMG_LOC + "3.jpg", name: "John Smith", designation: "Founder", discord: "@handle" },
  { img: IMG_LOC + "9.jpg", name: "John Smith", designation: "Founder", discord: "@handle" },
  { img: IMG_LOC + "2.jpg", name: "John Smith", designation: "Founder", discord: "@handle" },
  { img: IMG_LOC + "7.jpg", name: "John Smith", designation: "Founder", discord: "@handle" },
  { img: IMG_LOC + "8.jpg", name: "John Smith", designation: "Founder", discord: "@handle" },
  { img: IMG_LOC + "1.jpg", name: "John Smith", designation: "Founder", discord: "@handle" },
];

const ITEMS = [
  { title: "Team", values: TEAM },
  { title: "Advisors", values: ADVISORS },
];

const ProfileComp = (props) => {
  return (
    <div className="mr-4 flex flex-col items-center">
      <img src={props.img} className="profile-img" />
      <h4>{props.name}</h4>
      <p>{props.designation}</p>
      <p>{props.discord}</p>
    </div>
  );
};

export const TeamAdvisors = () => {
  return (
    <div className="team-advisors flex flex-col justify-center text-white" id="team">
      {ITEMS.map((item) => (
        <section className="flex flex-col justify-center items-center" key={item.title}>
          <h1 className="heading">{item.title}</h1>
          <div className="flex flex-col justify-center items-center">
            <div className="row flex flex-row items-center mb-4">
              {item.values.slice(0, 5).map((k, i) => (
                <ProfileComp key={i} {...k} />
              ))}
            </div>
            <div className="row flex flex-row items-center">
              {item.values.slice(5).map((k, i) => (
                <ProfileComp key={i} {...k} />
              ))}
            </div>
          </div>
        </section>
      ))}

    </div>
  );
};
