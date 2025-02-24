import React, { useState } from "react";
import Header from "../components/Header/Header";
import Image from "next/image";
import aboutImage from "../public/bg-img/img-about.jpg";
import Footer from "../components/Footer/Footer";
import { CONTACT_REF } from "../firebase/config";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { MdOutlineEmail } from "react-icons/md";

const About = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [error, setError] = useState(false);
  const [sucess, setSucess] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const rawResponse = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const content = await rawResponse.json();
    if (content) {
      console.log(content);
    }
  };

  const clearForm = () => {
    setUserEmail("");
    setUserName("");
    setUserMessage("");
  };

  const submitContact = async () => {
    try {
      setLoading(true);
      if (userEmail != "" && userName != "" && userMessage != "") {
        await addDoc(CONTACT_REF, {
          date: serverTimestamp(),
          name: userName,
          email: userEmail,
          message: userMessage,
        });

        setSucess(true);
        clearForm();
        setTimeout(() => {
          setSucess(false);
        }, 3000);

        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setError(true);
      setLoading(false);
    }
  };
  return (
    <div>
      <Header title={`About YourCompany`} transparent={true} />
      <div className="section-about -mt-20">
        <div className="uk-section-large uk-container">
          <h1 className="text-center font-FaunaOne text-6xl font-semibold my-14 title__about relative">
            About us
          </h1>
          <div className="uk-grid uk-child-width-1-2@m" data-uk-grid>
            <div>
              <div className="section-about__media _anim">
                <div className="relative">
                  <Image src={aboutImage} alt="" className="w-full" />
                </div>
              </div>
            </div>
            <div>
              <div
                className="section-about__desc"
                data-uk-scrollspy="target: > *; cls: uk-animation-slide-bottom-small; delay: 300"
              >
                <div className="section-title">
                  <span>E Learning Platform</span>
                  <h3 className="font-Cormorant">Welcome to a new way of learning.</h3>
                </div>
                <div className="section-content">
                  <p className="mb-8">
                  Welcome to Query Education, where we leverage cutting-edge technology to enhance your digital experience. 
                  Our mission is to provide innovative solutions that empower businesses and enrich customer interactions.
                  </p>
                  {/* <a
                    className="bg-primary text-center uppercase my-12 block w-fit hover:bg-black hover:text-white hover:no-underline transition-all duration-500 px-12 py-6 font-FaunaOne text-xl text-white"
                    href="#"
                  >
                    view collection
                  </a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mb-20">
          <div className="lg:w-7/12 mb-3">
            <h1 className="text-xl font-bold text-left">Know us more</h1>
            <p className=" lg:text-lg ">
              Explore our courses.
            </p>
          </div>
          <div className="lg:w-7/12 mb-3">
            <h1 className="text-xl font-bold text-left">Our company</h1>
            <p className=" lg:text-lg ">
              Practise oriented courses.
            </p>
          </div>
          <div className="lg:w-7/12 mb-3">
            <h1 className="text-xl font-bold text-left">How we work</h1>
            <p className=" lg:text-lg ">
            Explore our courses.
            </p>
          </div>
        </div>
      </div>

      <section className="bg-lightWhite dark:bg-slate-800" id="contact">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-4">
            <div className="mb-6 max-w-3xl text-center sm:text-center md:mx-auto md:mb-12">
              <h2 className="font-heading mb-4 font-bold tracking-tight text-gray-900 dark:text-white text-3xl sm:text-5xl">
                Get in Touch
              </h2>
            </div>
          </div>
          <div className="flex items-stretch justify-center">
            <div className="grid md:grid-cols-2">
              <div className="h-full pr-6">
                <h1 className="text-lg text-gray-600 -mb-2">
                  {" "}
                  Questions or Comments?
                </h1>
                <p className="mt-3 mb-12 text-lg text-gray-600 dark:text-slate-400">
                  You can send me a message or ask me a general question using
                  this form. I will do my best to get back to you soon!
                </p>
                <ul className="mb-6 md:mb-0">
                  <li className="flex">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-900 text-gray-50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                        <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
                      </svg>
                    </div>
                    <div className="ml-4 mb-4">
                      <h3 className="mb-2 text-lg font-medium leading-6 text-gray-900 dark:text-white">
                        Location
                      </h3>
                      <p className="text-gray-600 dark:text-slate-400">
                        United Kingdom
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-900 text-gray-50">
                      <MdOutlineEmail size={25} className="-mt-2" />
                    </div>
                    <div className="ml-4 mb-4">
                      <h3 className="mb-2 text-lg font-medium leading-6 text-gray-900 dark:text-white">
                        Contact
                      </h3>
                      <div className="text-gray-600 dark:text-slate-400 ">
                        <span>contact</span>@<span>queryed.com</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="card h-fit max-w-6xl p-5 md:p-12" id="form">
                <h2 className="mb-4 text-2xl font-bold dark:text-white">
                  Ready to Get Started?
                </h2>
                <form id="contactForm">
                  <div className="mb-6">
                    <div className="mx-0 mb-1 sm:mb-4">
                      <div className="mx-0 mb-1 sm:mb-4">
                        <label
                          htmlFor="name"
                          className="pb-1 text-xs uppercase tracking-wider"
                        />
                        <input
                          onChange={(e) => setUserName(e.currentTarget.value)}
                          type="text"
                          value={userName}
                          id="name"
                          autoComplete="given-name"
                          placeholder="Your name"
                          className="mb-2 w-full rounded-md border border-gray-400 py-2 pl-2 pr-4 shadow-md dark:text-gray-300 sm:mb-0"
                          name="name"
                        />
                      </div>
                      <div className="mx-0 mb-1 sm:mb-4">
                        <label
                          htmlFor="email"
                          className="pb-1 text-xs uppercase tracking-wider"
                        />
                        <input
                          onChange={(e) => setUserEmail(e.currentTarget.value)}
                          value={userEmail}
                          type="email"
                          id="email"
                          autoComplete="email"
                          placeholder="Your email address"
                          className="mb-2 w-full rounded-md border border-gray-400 py-2 pl-2 pr-4 shadow-md dark:text-gray-300 sm:mb-0"
                          name="email"
                        />
                      </div>
                    </div>
                    <div className="mx-0 mb-1 sm:mb-4">
                      <label
                        htmlFor="textarea"
                        className="pb-1 text-xs uppercase tracking-wider"
                      />
                      <textarea
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.currentTarget.value)}
                        id="textarea"
                        name="textarea"
                        cols={30}
                        rows={5}
                        placeholder="Write your message..."
                        className="mb-2 w-full rounded-md border border-gray-400 py-2 pl-2 pr-4 shadow-md dark:text-gray-300 sm:mb-0"
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      disabled={loading}
                      onClick={submitContact}
                      type="button"
                      className="w-full bg-primary bg-blue-800 text-black px-6 py-3 font-xl rounded-md sm:mb-0"
                    >
                      {loading ? "sending...." : "Send Message"}
                    </button>
                  </div>

                  <div>
                    {error && (
                      <div className="bg-red py-4 px-3">
                        <h5 className="text-md font-normal text-white">
                          OOps, something happened please try again later
                        </h5>
                      </div>
                    )}
                    {sucess && (
                      <div className="bg-green py-4 px-3">
                        <h5 className="text-sm font-normal ">
                          Thank you for contacting us, we will get back to you
                          as soon as posible
                        </h5>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
