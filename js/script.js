// import mapboxItems from "./mapboxItems.js";
(async function () {
  const data = await fetch("./data/public-repos-with-last-commit.json").then((response) =>
    response.json()
  );

  const colors = await fetch("./data/colors.json").then((response) =>
    response.json()
  );

  let grid = GridStack.init({
    staticGrid: true,
    margin: 1,
  });

  // add a column for every 112 px of width past 560
  const MINWIDTH = 1000;
  const PIXELS_PER_COLUMN = 100;
  function resizeGrid() {
    let width = document.body.clientWidth;

    let numColumns = 4;

    const additionalColumns =
      Math.floor((width - MINWIDTH) / PIXELS_PER_COLUMN) + 1;
    numColumns += additionalColumns;

    const cellHeight = `${100 / numColumns}vw`;

    grid.column(numColumns, "moveScale").cellHeight(cellHeight);
    grid.compact();
  }

  const languages = _.uniq(data, d => d.language).map(d => d.language?.toLowerCase());

  console.log(languages);

  // sort by stargazers_count
  const sorted = _.sortBy(data, d => d.stargazers_count).reverse()



  const items = sorted.map((item) => {
    const { name, description, stargazers_count, html_url, language } = item;
    const color = colors[language] ? colors[language].color : '#ccc'

    // if (type === "category") {
    //   return {
    //     minW: 3,
    //     maxW: 3,
    //     minH: 3,
    //     maxH: 3,
    //     content: `
    //         <div class='grid-stack-item-content-inner category-tile category-${category}'>
    //             <div class='title'>${title}</div>
    //             <div class='subtitle'>${subTitle}</div>
    //         </div>
    //     `,
    //   };
    // }

    return {
      minW: 1,
      maxW: 1,
      minH: 1,
      maxH: 1,
      content: `
        <a href=${html_url} target="_blank"> 
        <div class="flip-card grid-stack-item-content-inner tile">
            <div class="flip-card-inner">
                <div class="flip-card-front text-center items-center flex flex-col justify-center p-3 box-border bg-slate-300	font-bold category-${
                  language ? language.toLowerCase() : "null"
                }">
                    <div class='absolute left-2 top-2 font-light bg-white rounded-full px-2 font-sans text-xs'>
                      <i class="fa-regular fa-star mr-1"></i>${numeral(stargazers_count).format('0,0')}
                    </div>
                    ${name} 
                    <div class='absolute left-2 bottom-2 font-light bg-white rounded-full px-2 font-sans text-xs'>
                    <i class="fa-solid fa-circle mr-1" style="width:8px;color:${color};"></i>${language}
                    </div>
                </div>
                <div class="flip-card-back text-center items-center flex flex-col justify-center p-3 box-border text-gray-700 border-4 border-solid bg-white font-medium text-xs category-${
                  language ? language.toLowerCase() : "null"
                }" style="transform: rotateX(180deg);"
                >
                    <div class="flip-card-back-inner">
                        ${description}
                    </div>
                </div>
            </div>
        </div>
        </a>
        `,
    };
  });
  grid.load(items);
  resizeGrid(); // finally size to actual window
})();

window.addEventListener("resize", function () {
  resizeGrid();
});
