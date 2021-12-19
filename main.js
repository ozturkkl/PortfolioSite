scrollOff();

const portrait = document.querySelector(".portrait");
const greet = document.querySelector(".greet");

const projectTemplate = document.querySelector(".projects template");
const projects = document.querySelector(".projects .projects-container");

const linkTemplate = document.querySelector(".links template");
const links = document.querySelector(".links .links-container");

const backTop = document.querySelector(".back-top");

// GREET
var options = {
  stringsElement: "#typed-strings",
  typeSpeed: 35,
  startDelay: 400,
  backSpeed: 10,
  smartBackspace: true,
  backDelay: 0,

  onComplete: () => {
    portrait.classList.add("fade-in");
    portrait.classList.add("slide-left");
    greet.classList.add("slide-right");
    greet.classList.add("big");
  },

  // fadeOut: true,
  // fadeOutClass: 'typed-fade-out',
  // fadeOutDelay: 1500,
};
var typed = new Typed("#greet", options);

// PROJECTS
fetch("https://api.github.com/users/ozturkkl/repos")
  .then((response) => response.json())
  .then((data) => {
    Promise.all(
      data.map((project) => {
        return new Promise((res, rej) => {
          const readme = `https://raw.githubusercontent.com/ozturkkl/${project.name}/master/README.md`;
          const projectTemplateNode = projectTemplate.content.cloneNode(true);

          fetch(readme)
            .then((response) => response.text())
            .then(async (data) => {
              let imageURL = data.match(/!\[.+\]\((.+)\)/);
              if (imageURL && imageURL[1]) {
                imageURL = imageURL[1];
                let imgElement = null;

                try {
                  imgElement = await loadImage(imageURL);
                } catch (e) {
                  console.log(e);
                }
                if (imgElement)
                  projectTemplateNode
                    .querySelector(".project")
                    .appendChild(imgElement);
              }

              projectTemplateNode
                .querySelector("a")
                .setAttribute("href", project.html_url);
              projectTemplateNode.querySelector("#title").innerText =
                project.name;
              projectTemplateNode.querySelector("#language").innerText =
                project.language;
              projectTemplateNode.querySelector("#description").innerText =
                project.description;

              projects.append(projectTemplateNode);
              res();
            });
        });
      })
    ).then(() => {
      scrollOn();

      window.location.hash &&
        document.querySelector(window.location.hash).scrollIntoView();
    });
  });

// LINKS
const linksObj = [
  {
    title: "LinkedIn",
    url: "https://www.linkedin.com/mwlite/in/ozturkkl",
    description: "If u send me konnekt, I konnekt. \n Send konnekt pls.",
    src: "images/links/LinkedIn.webp",
  },
  {
    title: "GitHub",
    url: "https://github.com/ozturkkl",
    description: "Most of the projects live here... \nIncluding this website.",
    src: "images/links/GitHub.webp",
  },
  {
    title: "YouTube",
    url: "https://www.youtube.com/channel/UCE2I4KMK3Jji75rcaEqhwHA",
    description:
      "Hey guyssss!!!!, welcome to my youtube channel. \n Remember to SuBScrIbE and lEAve A LiEk",
    src: "images/links/YouTube.svg",
  },
  {
    title: "Embed",
    html: `<iframe class="embed" width="560" height="315" src="https://www.youtube.com/embed/b2C7c3MK9wY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
  },
  {
    title: "Twitch.Tv",
    url: "https://www.twitch.tv/kemal_ozt",
    description: "Programmer by day, gamer by night. \n What are we playing?",
    src: "images/links/Twitch.Tv.svg",
  },
  {
    title: "Steam",
    url: "https://steamcommunity.com/profiles/76561198068939833/",
    description: "Are we gonna play together??? \n Hit me up!",
    src: "images/links/Steam.webp",
  },
  {
    title: "Discord",
    url: "https://discord.gg/Cpzf6qY",
    description: `Join the community, not an active one... \n But still there \\_('. .)_/`,
    src: "images/links/Discord.webp",
  },
  {
    title: "Instagram",
    url: "https://www.instagram.com/ozturk_kl/",
    description: `I don't post here much but message me! \n I'll reply ✍`,
    src: "images/links/Instagram.svg",
  },
];
for (link of linksObj) {
  const linkTemplateNode = linkTemplate.content.cloneNode(true);

  if (link.title === "Embed") {
    const embedDiv = document.createElement("div");
    embedDiv.innerHTML = link.html;
    links.append(embedDiv);
    continue;
  }
  if (link.src.search(/\.svg$/) === -1) {
    linkTemplateNode.querySelector("#icon").classList.add("not-svg");
  }

  linkTemplateNode.querySelector("a").setAttribute("href", link.url);
  linkTemplateNode.querySelector("#icon").setAttribute("src", link.src);
  linkTemplateNode.querySelector("#title").innerText = link.title;
  linkTemplateNode.querySelector("#description").innerText = link.description;

  links.append(linkTemplateNode);
}

// EVENTS
window.addEventListener("scroll", (e) => {
  if (document.documentElement.scrollTop > 500) {
    backTop.classList.add("visible");
  }
  if (document.documentElement.scrollTop < 500) {
    backTop.classList.remove("visible");
  }
});
backTop.addEventListener("click", () => {
  window.scrollTo(0, 0);
});

// HELPER
function disableScroll(e) {
  e.preventDefault();
  window.scrollTo(0, 0);
}
function scrollOff() {
  document.body.addEventListener("dragstart", (e) => {
    e.preventDefault();
  });
  document.body.style.overflow = "hidden";
  window.addEventListener("scroll", disableScroll);
}
function scrollOn() {
  window.removeEventListener("scroll", disableScroll);
  document.body.style.overflow = "visible";
  setTimeout(() => {
    document.body.parentElement.style.scrollBehavior = "smooth";
  }, 0);
}
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
