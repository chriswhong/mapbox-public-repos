import { Octokit } from "octokit";
import * as dotenv from "dotenv";
import moment from "moment";
import fs from "fs";

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

const repos = await octokit.paginate(
  "GET /orgs/{org}/repos",
  {
    org: "mapbox",
    public: true,
    per_page: 100,
  },
  (response) =>
    response.data
      .map(
        ({
          name,
          description,
          fork,
          html_url,
          size,
          watchers,
          forks_count,
          updated_at,
          pushed_at,
          stargazers_count,
          language,
        }) => {
          return {
            name,
            description,
            fork,
            html_url,
            size,
            watchers,
            forks_count,
            updated_at,
            pushed_at,
            stargazers_count,
            language,
          };
        }
      )
);

console.log(repos);
let data = JSON.stringify(repos, null, 2);
fs.writeFileSync("../data/public-repos.json", data);
