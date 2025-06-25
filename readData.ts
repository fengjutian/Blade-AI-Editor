import fs from "fs";
import path from "path";

const readData = async(dir: string) => {
  const dataDirectory = path.join(process.cwd(), dir);
  const filenames = await fs.readdir(dataDirectory);

  const dataItems = filenames.map(async(filename) => {
    const filePath = path.join(dataDirectory, filename);
    const fileContents = await fs.readFile(filePath, "utf8");
    const parsedItem = JSON.parse(fileContents);
    return parsedItem;
  });
  return {
    data: await Promise.all(dataItems),
  };
};

export default readData;