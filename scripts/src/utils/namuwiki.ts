import axios from "axios";
import * as cheerio from "cheerio";
import { writeFile } from "fs/promises";

const NAMUWIKI_BASE_URL = "https://namu.wiki";

export enum NamuwikiDocuemntType {
  Article = "ARTICLE",
  SubArticle = "SUB_ARTICLE",
  Image = "IMAGE",
  Category = "CATEGORY",
  Redirect = "REDIRECT",
  SubRedirect = "SUB_REDIRECT",
  User = "USER",
}

interface NamuwikiSearchResult {
  title: string;
  variation?: string;
  docType: NamuwikiDocuemntType;
  content: string | null;
  url: string;
}

// 분류 조회
const getCategory = async ({
  category,
  url,
}: {
  category?: string;
  url?: string;
}) => {
  if (!category && !url) return null;

  const CATEGORY_STR = encodeURIComponent("분류");
  console.info(`Get category: ${category}${url}`);
  const res = await axios.get(
    category
      ? `${NAMUWIKI_BASE_URL}/w/${CATEGORY_STR}:${encodeURIComponent(category)}`
      : url!,
  );

  if (!res.data) {
    console.error("Failed to fetch data");
    return null;
  }

  const $ = cheerio.load(res.data);

  // 분류 하위 문서
  const subArticles: string[] = [];
  // 분류 하위 분류
  const subCategories: string[] = [];

  //$('div #category-분류') 안에 있는 두 번째 div 안에 있는 두 번째 div
  const categoryDiv = $("div #category-분류");
  categoryDiv.find("li").each((index, element) => {
    subCategories.push($(element).text().replace(/\n/g, "").trim());
  });

  const articleDiv = $("div #category-문서");
  articleDiv.find("li").each((index, element) => {
    subArticles.push($(element).text().replace(/\n/g, "").trim());
  });

  let nextPageUrl = "";
  articleDiv.find("a").each((index, element) => {
    if ($(element).find("span").text() === "다음") {
      nextPageUrl = NAMUWIKI_BASE_URL + ($(element).attr("href") || "");
    }
  });

  // 다음 페이지가 있다면 재귀 호출
  if (nextPageUrl) {
    // 0.5초 휴식
    await new Promise((resolve) => setTimeout(resolve, 500));

    const next = await getCategory({ url: nextPageUrl });
    if (next) {
      subArticles.push(...next.subArticles);
      subCategories.push(...next.subCategories);
    }
  }

  // 확인을 위해 category.html로 저장
  await writeFile("category.html", categoryDiv.html() || "없음", "utf-8");

  return {
    subArticles,
    subCategories,
  };
};

const arg = process.argv.slice(2).join(" ");
if (arg) {
  getCategory({ category: arg }).then((v) => {
    // json도 저장
    writeFile("category.json", JSON.stringify(v, null, 2), "utf-8").then();
  });
}