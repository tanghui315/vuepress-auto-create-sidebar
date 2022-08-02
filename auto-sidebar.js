const fs = require("fs");
const path = require("path");

const sidebar = {
  base: "",
  getSidebar() {
    const root = getRoot();
    const dirs = fs.readdirSync(root).filter((file) => {
      return (
        file !== ".vuepress" &&
        fs.statSync(path.join(root, file)).isDirectory() &&
        file !== "images" &&
        file !== "assets"
      );
    });
    return _getSidebar(dirs, root, null);
  },
};

const _getSidebar = function (dirs, root, parentPath) {
  let sidebars = [];
  for (let index = 0; index < dirs.length; index++) {
    const fileName = dirs[index];
    let name = "";
    let sortName = fileName.replace(/\.md/g, "");
    let children = [];
    let currentPathName = "";
    const childDirPath = path.resolve(root, fileName);
    const isDirectory = fs.statSync(childDirPath).isDirectory();
    if (isDirectory) {
      name = getNameByDir(childDirPath, true);
      const childrenDirs = fs
        .readdirSync(childDirPath)
        .filter(
          (file) =>
            file !== ".vuepress" &&
            file !== "images" &&
            file !== "assets" &&
            file !== "readme.md" &&
            file !== "README.md"
        );
      if (childrenDirs.length) {
        parentPath = childDirPath.split(getExtraPath())[1];
        children = _getSidebar(childrenDirs, childDirPath, parentPath);
      }
    } else if (
      fs.statSync(childDirPath).isFile() &&
      path.extname(fileName) == ".md"
    ) {
      name = getNameByDir(childDirPath, false);
      currentPathName = parentPath
        ? path.join("/", parentPath, fileName)
        : path.join("/", fileName);
    } else {
      continue;
    }
    const sName = sortName ? sortName : fileName;
    let result = {
      text: name ? name : sortNameToName(sName),
      sortName: sName,
      link: getPath(parentPath, currentPathName, fileName),
    };
    if (children.length) {
      result.children = children;
    }
    if (isDirectory && !name) {
      delete result.path;
    }
    sidebars.push(result);
  }
  // sort
  sidebars = sidebars.sort((a, b) => {
    const reg = /\d+/g;
    const aNum = a.sortName.match(reg);
    const bNum = b.sortName.match(reg);
    if (aNum && bNum) {
      return aNum[0] - bNum[0];
    }
    return 0;
  });
  // prune
  return sidebars.map((item) => {
    delete item.sortName;
    return item;
  });
};

const getPath = function (parentPath, parentPathName, fileName) {
  return parentPathName || (parentPath ? parentPath : path.join("/", fileName));
};

const sortNameToName = function (sortName) {
  const regex = /\d+\s*\.\s*(\S+)(\.md)*/g;
  const found = regex.exec(sortName);
  if (found && found[1]) {
    return found[1];
  }
  return sortName;
};

const getNameByDir = function (filePath, isDir) {
  let readPath = filePath;
  if (isDir) {
    readPath = path.join(filePath, "README.md");
    if (!fs.existsSync(readPath)) {
      readPath = path.join(filePath, "readme.md");
      if (!fs.existsSync(readPath)) {
        return null;
      }
    }
  }
  const data = fs.readFileSync(readPath, "UTF-8");
  const lines = data.split(/\r?\n/);
  if (lines && lines.length) {
    return lines[0].replace(/#/g, "").replace(/\s/g, "");
  }
  return null;
};

const getExtraPath = function () {
  return process.argv.length > 3 ? `/${process.argv[3]}` : "/docs";
};

const getRootDir = function () {
  return path.resolve(process.cwd() + getExtraPath());
};

const getRoot = function () {
  let root;
  if (!!sidebar.base) {
    root = path.join(getRootDir(), sidebar.base);
  } else {
    root = getRootDir();
  }
  return root;
};

module.exports = sidebar;
