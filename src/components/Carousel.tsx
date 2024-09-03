import * as React from "react";
import { Image } from "@yext/pages/components";
import { Markdown } from "react-showdown";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = ({ data, type, document, slidesToShow }: any) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {data.map((item: any, index: number) => {
        const {
          c_photo,
          c_subtitle,
          c_subtitle2,
          name,
          richTextDescription,
          description,
          shortDescription,
        } = item;

        return (
          <div key={index} className="border p-4 shadow-lg flex flex-col gap-4">
            {c_photo && (
              <div>
                <Image
                  image={c_photo}
                  style={{ height: "170px !important" }}
                  className="max-w-full w-1/2 mb-4"
                ></Image>
              </div>
            )}
            <div className="text-orange-500 carTitle">{name}</div>
            {shortDescription && (
              <div className="mt-4 ">
                <Markdown markdown={shortDescription}></Markdown>
              </div>
            )}
            <p className="mt-4 font-bold">
              Read more <span className="font-normal">&#x3e;</span>
            </p>
          </div>
        );
      })}
    </Slider>
  );
};

export default Carousel;
