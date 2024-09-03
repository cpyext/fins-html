/**
 * This is an example of how to create a template that makes use of streams data.
 * The stream data originates from Yext's Knowledge Graph. When a template in
 * concert with a stream is built by the Yext Sites system, a static html page
 * is generated for every corresponding (based on the filter) stream document.
 *
 * Another way to think about it is that a page will be generated using this
 * template for every eligible entity in your Knowledge Graph.
 */

import {
  GetHeadConfig,
  GetPath,
  GetRedirects,
  HeadConfig,
  Template,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import * as React from "react";
import Cta from "../components/cta";
import "../index.css";
import Product from "../types/products";
import { Image } from "@yext/pages/components";
import { FaHandHoldingUsd } from "react-icons/fa";
import { ImGift } from "react-icons/im";
import { FiChevronRight } from "react-icons/fi";
import { GiStarSattelites } from "react-icons/gi";
import { BsCash } from "react-icons/bs";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import Carousel from "../components/Carousel";
import SearchBarHead from "../components/SearchBarHead";
import {
  provideHeadless,
  SearchHeadlessProvider,
} from "@yext/search-headless-react";
import searchConfig from "../components/searchConfig";

/**
 * Required when Knowledge Graph data is used for a template.
 */
export const config: TemplateConfig = {
  stream: {
    $id: "my-stream-id-1",
    // Specifies the exact data that each generated document will contain. This data is passed in
    // directly as props to the default exported function.
    fields: [
      "id",
      "uid",
      "meta",
      "name",
      "description",
      "c_relatedProducts.name",
      "c_relatedProducts.photoGallery",
      "c_relatedProducts.landingPageUrl",
      "c_relatedProducts.price",
      "c_relatedFAQs.question",
      "c_relatedFAQs.answer",
      "c_relatedBlogs.landingPageUrl",
      "c_relatedBlogs.c_photo",
      "c_relatedBlogs.c_subtitle",
      "c_relatedBlogs.c_subtitle2",
      "c_relatedBlogs.name",
      "c_relatedBlogs.richTextDescription",
      "c_relatedBlogs.shortDescription",
    ],
    // Defines the scope of entities that qualify for this stream.
    filter: {
      entityTypes: ["ce_productCategory"],
    },
    // The entity language profiles that documents will be generated for.
    localization: {
      locales: ["en"],
      primary: false,
    },
  },
};

/**
 * Defines the path that the generated file will live at for production.
 *
 * NOTE: This currently has no impact on the local dev path. Local dev urls currently
 * take on the form: featureName/entityId
 */
export const getPath: GetPath<TemplateProps> = ({ document }) => {
  return document.slug ? document.slug : `${document.id.toString()}`;
};

/**
 * Defines a list of paths which will redirect to the path created by getPath.
 *
 * NOTE: This currently has no impact on the local dev path. Redirects will be setup on
 * a new deploy.
 */
export const getRedirects: GetRedirects<TemplateProps> = ({ document }) => {
  return [`index-old/${document.id.toString()}`];
};

/**
 * This allows the user to define a function which will take in their template
 * data and procude a HeadConfig object. When the site is generated, the HeadConfig
 * will be used to generate the inner contents of the HTML document's <head> tag.
 * This can include the title, meta tags, script tags, etc.
 */
export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  relativePrefixToRoot,
  path,
  document,
}): HeadConfig => {
  return {
    title: document.name,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
    tags: [
      {
        type: "meta",
        attributes: {
          name: "description",
          content: document.description,
        },
      },
    ],
  };
};

/**
 * This is the main template. It can have any name as long as it's the default export.
 * The props passed in here are the direct stream document defined by `config`.
 *
 * There are a bunch of custom components being used from the src/components folder. These are
 * an example of how you could create your own. You can set up your folder structure for custom
 * components any way you'd like as long as it lives in the src folder (though you should not put
 * them in the src/templates folder as this is specific for true template files).
 */
const Location: Template<TemplateRenderProps> = ({
  relativePrefixToRoot,
  path,
  document,
}) => {
  const {
    _site,
    name,
    description,
    c_relatedProducts,
    c_relatedFAQs,
    c_relatedBlogs,
  } = document;
  const searcher = provideHeadless(searchConfig);

  const placeholder =
    "Example: \n 5 x Hyperion Pioneer Decking Range - 145mm x 4m\n6 x RM 555 Universal Cleaner 5l\n 2 x Knauf Bonding Compound Plasterboard Adhesive 25kg";
  return (
    <>
      <SearchHeadlessProvider searcher={searcher}>
        <div>
          <div className=" md:relative">
            <span className="hidden md:block">
              <Image image={document._site.c_header_desk}></Image>
            </span>
            <span className="block md:hidden">
              <Image image={document._site.c_header_mob}></Image>
            </span>
            <span className="md:absolute w-full bottom-0 md:top-1/2 md:-translate-y-1/2">
              <SearchBarHead />
            </span>
          </div>

          <div className="centered-container my-8">
            <h1 className="text-center text-3xl font-bold">{name}</h1>
            <div className="mt-4">{description}</div>
            <div className="mt-8">
              <div className="border-4 border-green-500 p-8 text-center">
                <div className="text-2xl font-bold">Coming Soon!</div>
                <div className="text-lg font-bold mt-4">
                  We appreciate your patience as we get all our products online.
                  Our full range offers something for everyone, and we can't
                  wait to share it with you. In the meantime, please feel free
                  to browse our related products below. Thank you for shopping
                  with us!
                </div>
              </div>
            </div>
            <div className="mt-8">
              <div className="font-bold">BUT YOU MIGHT BE INTERESTED IN...</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {c_relatedProducts.map((item: Product, index: number) => (
                  <div key={index} className="border p-4">
                    {item.landingPageUrl && (
                      <a href={item.landingPageUrl} target="_blank">
                        {item.photoGallery && (
                          <Image image={item.photoGallery[0]}></Image>
                        )}
                        <div className="mt-4">{item.name}</div>
                        <div className="mt-2 font-bold text-center">
                          &#163; {item.price?.value || 8.55}
                        </div>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <div className="font-semibold mt-4">
                Welcome to
                <span className="text-lg font-bold"> Build4less Points</span>
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-8 border rounded-2xl">
                    <div className="text-center">
                      <h2 className="font-semibold">Become a member</h2>
                      <div className="mt-2 text-gray-600 mb-8">
                        With more ways to unlock exciting perks, this is your
                        all access pass to exclusive rewards.
                      </div>
                      <Cta
                        buttonText={"Join now"}
                        url={""}
                        style="primary-cta"
                      ></Cta>
                      <div className="mt-8">
                        Already have an account?{" "}
                        <a
                          href="https://build4less.co.uk/account/login"
                          className="text-cyan-500"
                        >
                          Sign in
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 border rounded-2xl">
                    <div className="text-center">
                      <h2 className="font-semibold">Points</h2>
                      <div className="mt-2 text-gray-600 mb-8 gap-4">
                        Earn more Points for different actions, and turn those
                        Points into awesome rewards!
                      </div>
                      <div className="p-8">
                        <div className="text-left flex border-b pb-6 gap-4 items-center">
                          <FaHandHoldingUsd /> ways to earn
                          <FiChevronRight className="ml-auto" />
                        </div>
                        <div className="text-left mt-4 flex gap-4 items-center">
                          <ImGift />
                          ways to Redeem <FiChevronRight className="ml-auto" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 border rounded-2xl">
                    <div className="text-center">
                      <h2 className="font-semibold">Referrals</h2>
                      <div className="mt-2 text-gray-600 mb-8">
                        Give your friends a reward and claim your own when they
                        make a purchase.
                      </div>
                      <div className="p-8">
                        <div className="text-left flex border-b pb-6 gap-4 items-center">
                          <BsCash />
                          <div>
                            <div> They get</div>
                            <div className="font-light">£10 off coupon</div>
                          </div>
                        </div>
                        <div className="text-left mt-4 flex gap-4 items-center">
                          <GiStarSattelites />
                          <div>
                            <div>You get</div>
                            <div className="font-light">1000 Points</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              {c_relatedFAQs && (
                <div className="w-full bg-gray-200 mb-8">
                  <div className="p-14 max-w-screen-2xl md:max-w-screen-lg mx-auto">
                    <h1 className="text-3xl font-normal">FAQs</h1>
                    <Accordion allowZeroExpanded>
                      {c_relatedFAQs.map((item: any, index: number) => (
                        <AccordionItem
                          className="py-2"
                          id={`faq-${index}`}
                          key={index}
                        >
                          <AccordionItemHeading>
                            <AccordionItemButton>
                              {item.question}
                            </AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <p>{item.answer}</p>
                          </AccordionItemPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              )}
            </div>
            {c_relatedBlogs && (
              <div className="mx-auto mt-8 max-w-screen-2xl">
                <h1 className="text-3xl font-normal mb-4 text-center ">
                  Blogs
                </h1>
                <div className="px-4 md: px-0">
                  <Carousel data={c_relatedBlogs} slidesToShow={3}></Carousel>
                </div>
              </div>
            )}
            <div className="mt-8">
              <h2 className="font-bold text-2xl text-center">Get A Quote</h2>
              <h2 className="mt-4 text-xl text-center md:text-left">
                Submit your materials list
              </h2>
              <p className="font-bold text-center md:text-left mt-4 mb-4">
                FILL OUT THE FORM BELOW, INCLUDING YOUR LIST OF MATERIALS, AND
                WE SHALL GET IN TOUCH WITH YOU.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name">Name</label>
                  <input type="text" name="name" className="border" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email">Email</label>
                  <input type="text" name="email" className="border" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="text" name="phone" className="border" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="jobs">Enter Jobsite Post Code *</label>
                  <input type="text" name="jobs" className="border" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="proj">When does your project start?</label>
                  <input type="text" name="proj" className="border" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="aa">Additional Information</label>
                  <input type="text" name="add" className="border" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="add">What Do You Prefer?</label>
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      id="html"
                      name="fav_language"
                      value="HTML"
                    />
                      <label htmlFor="html">Email</label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      id="css"
                      name="fav_language"
                      value="CSS"
                    />
                      <label htmlFor="css">Phone</label>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="nn">Are you a contractor?</label>
                  <div className="flex gap-2">
                    <input type="radio" id="html" name="yesNo" value="Yes" />
                    <label htmlFor="html">Yes</label>
                  </div>
                  <div className="flex gap-2">
                    <input type="radio" id="css" name="yesNo" value="No" />
                    <label htmlFor="css">No</label>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex flex-col gap-2">
                    <label>
                      Enter your material list below (Qty x Product Name):
                    </label>
                    <textarea
                      name="Text1"
                      cols={60}
                      rows={5}
                      className="border"
                      placeholder={placeholder}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="text-center md:text-left mt-8">
                <Cta style="primary-cta" buttonText="SEND" url={""}></Cta>
              </div>
            </div>
          </div>
          <span className="block md:hidden">
            <Image image={document._site.c_footer_mob}></Image>
          </span>
          <span className="hidden md:block">
            <Image image={document._site.c_footer_desk}></Image>
          </span>
        </div>
      </SearchHeadlessProvider>
    </>
  );
};

export default Location;
