import { Typewriter } from "react-simple-typewriter";
import { Create, Pin } from "../assets";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Feature = () => {
  useGSAP(() => {
    gsap.fromTo(
      "#create-image",
      {
        x: -100,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        ease: "power1.inOut",
        duration: 1,
        scrollTrigger: {
          trigger: "#create-image",
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          markers: true,
        },
      }
    ),
      gsap.fromTo(
        "#create-text",
        {
          x: 100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          ease: "power1.inOut",
          duration: 1,
          scrollTrigger: {
            trigger: "#create-text",
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            markers: true,
          },
        }
      ),
      gsap.fromTo(
        "#pin-text",
        {
          x: -100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          ease: "power1.inOut",
          duration: 1,
          scrollTrigger: {
            trigger: "#pin-text",
            start: "top 75%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            markers: true,
          },
        }
      ),
      gsap.fromTo(
        "#pin-image",
        {
          x: 100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          ease: "power1.inOut",
          duration: 1,
          scrollTrigger: {
            trigger: "#pin-image",
            start: "top 60%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            markers: true,
          },
        }
      );
  }, []);

  return (
    <section className="px-4 max-w-[1400px] w-full mx-auto py-16">
      {/* <h2 className="font-normal">
        <Typewriter
          words={["Powerful features, beautifully simple."]}
          loop={0}
          cursor
          cursorStyle="|"
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={1000}
        />
      </h2> */}

      <div className="flexCenter flex-col md:flex-row  gap-10 mt-10 ">
        <div
          className="w-full flex items-center justify-center  "
          id="create-image"
        >
          <img src={Create} alt="Create" className="object-contain w-[300px]" />
        </div>
        <div className="w-full" id="create-text">
          <h2 className="md:text-[50px] text-textMd font-bold font-montserrat ">
            ✏️ Create Note
          </h2>
          <ul className="space-y-3 text-gray-300 text-textSm mt-2 ">
            <li className="flex items-center gap-3 list-disc">
              <span className="w-2.5 h-2.5 bg-[#20ffff] " />
              Add a title and content
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[#20ffff] " />
              Instant access on return
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[#20ffff] " />
              Minimal, distraction-free UI
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[#20ffff] " />
              All notes saved automatically
            </li>
          </ul>
        </div>
      </div>

      <div className="flexCenter flex-col md:flex-row gap-10 mt-10 ">
        <div className="w-full" id="pin-text">
          <h2 className="md:text-[50px] text-textMd font-bold font-montserrat ">
            📌 Pin Notes
          </h2>
          <ul className="space-y-3 text-gray-300 text-textSm mt-2 ">
            <li className="flex items-center gap-3 list-disc">
              <span className="w-2.5 h-2.5 bg-[#20ffff] " />
              Organize key ideas without losing them
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[#20ffff] " />
              Pinned notes stay visible and easy to access
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[#20ffff] " />
              Tap once to filter all your pinned items
            </li>
          </ul>
        </div>
        <div
          className="w-full flex items-center justify-center  "
          id="pin-image"
        >
          <img src={Pin} alt="Create" className="object-contain" />
        </div>
      </div>
    </section>
  );
};

export default Feature;
