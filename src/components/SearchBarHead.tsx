import searchConfig from "./searchConfig";
import * as React from "react";
import {
  DropdownItem,
  SearchBar,
  VisualAutocompleteConfig,
} from "@yext/search-ui-react";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  provideHeadless,
  SearchHeadlessProvider,
  useSearchActions,
} from "@yext/search-headless-react";
import classNames from "classnames";

const SearchBarHead = () => {
  const onSearch = (searchEventData: {
    verticalKey?: string;
    query?: string;
  }) => {
    const { query } = searchEventData;
    if (query)
      window.open(
        "https://honestly-useless-panda.pgsdemo.com/?query=" + query,
        "_blank"
      );
  };
  const [queryPrompts, setQueryPrompts] = useState<string[]>([]);
  const words = ["CSS3.", "HTML5.", "javascript."];
  let i = 0;
  let timer;

  function typingEffect() {
    let word = queryPrompts[i].split("");
    var loopTyping = function () {
      if (word.length > 0) {
        let ele = document.querySelector(".demo") as HTMLInputElement;
        ele.placeholder += word.shift();
      } else {
        deletingEffect();
        return false;
      }
      timer = setTimeout(loopTyping, 65);
    };
    loopTyping();
  }

  function deletingEffect() {
    let word = queryPrompts[i].split("");
    var loopDeleting = function () {
      if (word.length > 0) {
        word.pop();
        let ele = document.querySelector(".demo") as HTMLInputElement;
        ele.placeholder = word.join("");
      } else {
        if (words.length > i + 1) {
          i++;
        } else {
          i = 0;
        }
        typingEffect();
        return false;
      }
      timer = setTimeout(loopDeleting, 35);
    };
    loopDeleting();
  }

  const fetchUnivPrompts = async () => {
    const apiKey = import.meta.env.YEXT_PUBLIC_API_KEY;
    const experienceKey = import.meta.env.YEXT_PUBLIC_EXP_KEY;
    const experienceVersion = "PRODUCTION";
    const locale = "en";
    var url = "https://liveapi.yext.com/v2/accounts/me/answers/autocomplete";
    url += "?v=20190101";
    url += "&api_key=" + apiKey;
    url += "&sessionTrackingEnabled=false";
    url += "&experienceKey=" + experienceKey;
    url += "&input=";
    url += "&version=" + experienceVersion;
    url += "&locale=" + locale;
    try {
      let res = await fetch(url);
      let body = await res.json();
      let qs = body.response.results.map((item: any) => {
        return item.value;
      });
      setQueryPrompts(qs);
    } catch (error) {
      console.log(error);
    }
  };
  const searchActions = useSearchActions();

  useLayoutEffect(() => {
    searchActions.setUniversal();
    searchActions.executeUniversalQuery();
  });
  useEffect(() => {
    fetchUnivPrompts();
  }, []);

  useEffect(() => {
    queryPrompts.length >= 1 && typingEffect();
  }, [queryPrompts]);

  const visualAutocompleteConfig: VisualAutocompleteConfig = {
    entityPreviewSearcher: provideHeadless({
      ...searchConfig,
      headlessId: "visual-autocomplete",
    }),
    includedVerticals: ["products"],
    universalLimit: { products: 4 },
    renderEntityPreviews: (
      isLoading,
      verticalKeyToResults,
      dropdownItemProps
    ) => {
      if (!verticalKeyToResults.products) {
        return null;
      }

      const { results } = verticalKeyToResults.products;
      const containerClassName = classNames({
        "opacity-50": isLoading,
        "flex ml-4 mt-1": true,
      });

      return (
        <div className={containerClassName}>
          {results.map((r, index) => (
            <DropdownItem
              value={r.name ?? ""}
              key={index + "-" + r.name}
              className="flex flex-col mb-3 mr-4 border rounded-md p-3 text-lg hover:bg-gray-100"
              focusedClassName="flex flex-col mb-3 mr-4 border rounded-md p-3 text-lg bg-gray-100"
              {...dropdownItemProps}
            >
              {renderProductPreview(r)}
            </DropdownItem>
          ))}
        </div>
      );
    },
  };
  const renderProductPreview = (product: any): JSX.Element => {
    console.log(JSON.stringify(product));

    return (
      <div className="flex flex-col items-center cursor-pointer hover:bg-gray-100 ">
        {product.rawData.c_customPhoto && (
          <img className="w-32" src={product.rawData.c_customPhoto} />
        )}
        <div className="font-semibold pl-3">{product.name}</div>
      </div>
    );
  };
  return (
    <>
      <div className="w-full">
        <SearchBar
          onSearch={onSearch}
          customCssClasses={{
            searchBarContainer:
              "w-full px-4 md:px-0 md:w-3/6 mt-4 mx-auto mb-auto ",
            inputElement: "demo ",
          }}
          visualAutocompleteConfig={visualAutocompleteConfig}
        />
      </div>
    </>
  );
};

export default SearchBarHead;
