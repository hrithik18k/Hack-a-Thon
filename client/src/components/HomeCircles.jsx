import React from "react";
import CountUp from "react-countup";
import "../styles/homecircles.css";

const HomeCircles = () => {
  return (
    <section className="container circles">
      <div className="circle">
        <CountUp
          start={0}
          end={1000}
          delay={0}
          enableScrollSpy={true}
          scrollSpyDelay={500}
        >
          {({ countUpRef }) => (
            <div className="counter">
              <span ref={countUpRef} />+
            </div>
          )}
        </CountUp>
        <span className="circle-name">
          Patients
          <br />
          Treated
        </span>
      </div>
      <div className="circle">
        <CountUp
          start={0}
          end={250}
          delay={0}
          enableScrollSpy={true}
          scrollSpyDelay={500}
        >
          {({ countUpRef }) => (
            <div className="counter">
              <span ref={countUpRef} />+
            </div>
          )}
        </CountUp>
        <span className="circle-name">
          Hospitals
          <br />
          Linked
        </span>
      </div>
      <div className="circle">
        <CountUp
          start={0}
          end={75}
          delay={0}
          enableScrollSpy={true}
          scrollSpyDelay={500}
        >
          {({ countUpRef }) => (
            <div className="counter">
              <span ref={countUpRef} />+
            </div>
          )}
        </CountUp>
        <span className="circle-name">
          Expert
          <br />
          Doctors
        </span>
      </div>
    </section>
  );
};

export default HomeCircles;
