import blogImg1 from "../../public/bg-img/news-card-1.jpg";
import blogImg2 from "../../public/bg-img/news-card-2.jpg";
import blogImg3 from "../../public/bg-img/news-card-3.jpg";
import blogImg4 from "../../public/bg-img/news-card-4.jpg";
import { BlogCard } from "../BlogCard/BlogCard";

const blogs = [
  {
    image: blogImg1,
    category: "Makeup",
    date: new Date(),
    title: "Beauty",
  },
  {
    image: blogImg2,
    category: "Makeup",
    date: new Date(),
    title: "Beauty",
  },
  {
    image: blogImg3,
    category: "Makeup",
    date: new Date(),
    title: "Beauty",
  },
  {
    image: blogImg4,
    category: "Makeup",
    date: new Date(),
    title: "Beauty",
  },
];

const Blogs = () => (
  <div className="section-new-arrivals section-news-and-posts">
    <div className="uk-background-muted">
      <div className="uk-section-large uk-container">
        <div
          className="section-title"
          data-uk-scrollspy="target: &gt; *; cls: uk-animation-slide-bottom-small; delay: 300"
        >
          <span>viasun Latest happenings</span>
          <h3 className="font-Cormorant">Articles From Blog</h3>
        </div>
        <div
          className="section-content"
          data-uk-scrollspy="target: &gt; *; cls: uk-animation-slide-bottom-small; delay: 300"
        >
          <div data-uk-slider>
            <div className="uk-position-relative">
              <ul className="uk-slider-items uk-grid uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-4@l">
                {blogs?.map((blog, _i) => (
                  <BlogCard key={_i} blog={blog as any} />
                ))}
              </ul>
            </div>
            <ul className="uk-slider-nav uk-dotnav uk-flex-center uk-margin-top">
              {" "}
            </ul>
          </div>
          <div className="uk-margin-medium-top uk-text-center">
            <a
              className=" px-10 py-6 border border-black w-fit text-black hover:border-primary uppercase block mx-auto hover:bg-primary hover:no-underline text-xl font-semibold hover:text-white transition-colors duration-500"
              href="04_blog-main.html"
            >
              Read full blog{" "}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Blogs;
