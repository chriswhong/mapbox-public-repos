import { Octokit } from "octokit";
import * as dotenv from "dotenv";
import moment from "moment";
import fs from "fs";

dotenv.config({ path: '../.env'});
console.log(process.env.GITHUB_ACCESS_TOKEN)

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

let reposJSON = fs.readFileSync("../data/public-repos.json");
let repos = JSON.parse(reposJSON);
// repos = repos.slice(0, 10);
// console.log(repos);

const twoYearsAgoMoment = moment().subtract(2, "years");

let reposWithLastCommit = [];

//https://api.github.com/repos/mapbox/osm-bright/commits
for (const repo of repos) {
  console.log(`Fetching latest commit for ${repo.name}`)
  try {
    const response = await octokit.rest.repos.listCommits({
      owner: "mapbox",
      repo: repo.name,
      per_page: 1,
    });
    const lastcommit_at = response.data[0].commit.author.date;
    reposWithLastCommit.push({
      ...repo,
      lastcommit_at,
    });
  } catch(e) {
    console.log(e)
  }

}

reposWithLastCommit = reposWithLastCommit.filter(d => moment(d.lastcommit_at).isAfter(twoYearsAgoMoment))

console.log(reposWithLastCommit, reposWithLastCommit.length)

let data = JSON.stringify(reposWithLastCommit, null, 2);
fs.writeFileSync("../data/public-repos-with-last-commit.json", data);
