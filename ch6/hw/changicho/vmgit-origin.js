var readline = require("readline");
var r = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class File {
  constructor(name) {
    this.name = name;
    this.createdAt = Date();
  }

  stringify() {
    return this.name + "\t" + this.createdAt.toLocaleString("ko-KR");
  }
}

class Commit {
  constructor(comment, files) {
    this.comment = comment;
    this.files = files; // [File]
    this.createdAt = Date();
  }

  stringify() {
    return 'commit "' + this.comment + '"\n' + this.fileStringify();
  }

  fileStringify() {
    return this.files.map(file => file.stringify()).join("\n");
  }
}

class Repository {
  constructor(name) {
    this.name = name;
    this.workFiles = []; //[File]
    this.stageFiles = []; //[File]
    this.commits = []; //[Commit]
    this.lastFileMap = new Object(); //{ File.name : File }
    this.createdAt = Date();
  }

  addWorking(filename) {
    var file = new File(filename);
    this.workFiles.push(file);
  }

  moveStaging(filename) {
    var file = this.workFiles.find(function(file) {
      return file.name == filename;
    });
    if (file == undefined) {
      return;
    }
    this.stageFiles.push(file);
    var index = this.workFiles.indexOf(file);
    this.workFiles.splice(index, 1);
  }

  commit(comment) {
    var newCommit = new Commit(comment, this.stageFiles);
    this.commits.push(newCommit);
    this.stageFiles.forEach(file => {
      this.lastFileMap[file.name] = file;
    });
    this.stageFiles = [];
    return newCommit;
  }

  touch(filename) {
    const lastFiles = Object.values(this.lastFileMap);
    var file = lastFiles.find(function(file) {
      return file.name == filename;
    });
    if (file == undefined) {
      return;
    }
    var touchFile = new File(file.name);
    this.workFiles.push(touchFile);
  }

  log() {
    console.log("--- push commit log");
    this.commits.forEach(commit => {
      console.log(commit.stringify());
    });
  }
}

class VCSLocal {
  constructor() {
    this.repositories = [];
    this.selectedRepository = -1;
  }

  make(repoName) {
    console.log("created " + repoName + " repository.");
    var repo = new Repository(repoName);
    this.repositories.push(repo);
  }

  select(name) {
    var found = this.repositories.find(function(repo) {
      return repo.name == name;
    });
    if (found != undefined) {
      this.selectedRepository = this.repositories.indexOf(found);
      return true;
    }
    this.selectedRepository = -1;
    return false;
  }

  isSelected() {
    return this.selectedRepository != -1;
  }

  currentRepo() {
    return this.repositories[this.selectedRepository];
  }

  showRepositories() {
    this.repositories.forEach(repo => {
      console.log(repo.name + "/");
    });
  }

  showStatus(name) {
    var repo;
    if (name == undefined) {
      repo = this.currentRepo();
      if (repo == undefined) {
        return;
      }
    } else {
      repo = this.repositories.find(function(repo) {
        return repo.name == name;
      });
      if (repo == undefined) {
        return;
      }
    }

    console.log("---Working Directory/");
    if (repo.workFiles.length > 0) {
      repo.workFiles.forEach(file => {
        console.log(file.stringify());
      });
      console.log("");
    }

    console.log("---Staging Area/");
    if (repo.stageFiles.length > 0) {
      repo.stageFiles.forEach(file => {
        console.log(file.stringify());
      });
      console.log("");
    }

    console.log("---Git Repository/");
    const lastFiles = Object.values(repo.lastFileMap);
    if (lastFiles.length > 0) {
      lastFiles.forEach(file => {
        console.log(file.stringify());
      });
    }
  }

  newfile(name) {
    const repo = this.currentRepo();
    if (repo == undefined) {
      return;
    }
    repo.addWorking(name);
  }

  moveStage(name) {
    const repo = this.currentRepo();
    if (repo == undefined) {
      return;
    }
    repo.moveStaging(name);
  }

  commit(comment) {
    const repo = this.currentRepo();
    if (repo == undefined) {
      return;
    }
    var commit = repo.commit(comment);
    console.log("---commit files/");
    console.log(commit.fileStringify());
  }

  touch(filename) {
    const repo = this.currentRepo();
    if (repo == undefined) {
      return;
    }
    repo.touch(filename);
  }

  log() {
    const repo = this.currentRepo();
    if (repo == undefined) {
      return;
    }
    repo.log();
  }
}

class VCSRemote {
  constructor() {
    this.repositories = [];
    this.selectedRepository = -1;
  }

  push(localRepo) {
    console.log("push some commits...");
    var commits = localRepo.commits.map(commit => {
      console.log(`commit "${commit.comment}" pushed`);
      var files = commit.files.map(file => {
        return Object.assign(new File(file.name), {
          createdAt: file.createdAt
        });
      });
      return new Commit(commit.comment, files);
    });
    var lastFileMap = new Object();
    const keys = Object.keys(localRepo.lastFileMap);
    keys.forEach(key => {
      const file = localRepo.lastFileMap[key];
      lastFileMap[key] = Object.assign(new File(file.name), {
        createdAt: file.createdAt
      });
    });

    var origin = this.repositories.find(function(repo) {
      return repo.name == localRepo.name;
    });
    if (origin == undefined) {
      const remoteRepo = new Repository(localRepo.name);
      remoteRepo.lastFileMap = lastFileMap;
      remoteRepo.commits = commits;
      remoteRepo.createdAt = localRepo.createdAt;
      this.repositories.push(remoteRepo);
    } else {
      origin.commits = commits;
      origin.lastFileMap = lastFileMap;
    }
  }

  showRepositories() {
    this.repositories.forEach(repo => {
      console.log(repo.name + "/");
    });
  }

  showStatus(name) {
    var repo;
    if (name == undefined) {
      this.showRepositories();
      return;
    } else {
      repo = this.repositories.find(function(repo) {
        return repo.name == name;
      });
      if (repo == undefined) {
        return;
      }
    }

    console.log("---Git Repository/");
    const lastFiles = Object.values(repo.lastFileMap);
    if (lastFiles.length > 0) {
      lastFiles.forEach(file => {
        console.log(file.stringify());
      });
    }
  }
}

var local = new VCSLocal();
var remote = new VCSRemote();

r.setPrompt("\n/> ");
r.prompt();
r.on("line", function(command) {
  if (command == "quit") {
    r.close();
  }
  var cli = command.split(" ");
  switch (cli[0]) {
    case "init":
      if (cli.length > 1) vminit(cli[1]);
      break;
    case "status":
      vmstatus(cli[1], cli[2]);
      break;
    case "checkout":
      vmcheckout(cli[1]);
      break;
    case "new":
      if (local.selectedRepository > -1) {
        vmnew(cli[1]);
      } else {
        console.log("please, checkout repository");
      }
      break;
    case "add":
      if (local.selectedRepository > -1) {
        vmadd(cli[1]);
      } else {
        console.log("please, checkout repository");
      }
      break;
    case "commit":
      if (local.selectedRepository > -1) {
        var temp = [...cli];
        temp.splice(0, 1);
        vmcommit(temp.join(" "));
      } else {
        console.log("please, checkout repository");
      }
      break;
    case "touch":
      if (local.selectedRepository > -1) {
        vmtouch(cli[1]);
      } else {
        console.log("please, checkout repository");
      }
      break;
    case "log":
      if (local.selectedRepository > -1) {
        vmlog();
      } else {
        console.log("please, checkout repository");
      }
      break;
    case "push":
      if (local.selectedRepository > -1) {
        vmpush();
      } else {
        console.log("please, checkout repository");
      }
      break;
    default:
      console.log("unknown command");
  }
  r.prompt();
});

r.on("close", function() {
  process.exit();
});

function vminit(repoName) {
  local.make(repoName);
}

function vmstatus(remoteOption, name) {
  if (remoteOption == "remote") {
    remote.showStatus(name);
    return;
  }
  if (local.isSelected() || name != undefined) {
    local.showStatus(name);
    return;
  }
  local.showRepositories();
}

function vmcheckout(name) {
  if (name == undefined) {
    local.select("");
    r.setPrompt("\n/> ");
    return;
  }
  if (local.select(name)) {
    r.setPrompt("\n/" + name + "/> ");
  }
}

function vmnew(name) {
  if (name == undefined) {
    console.log("please, input filename");
  }
  local.newfile(name);
}

function vmadd(name) {
  if (name == undefined) {
    console.log("please, input filename");
  }
  local.moveStage(name);
}

function vmcommit(comment) {
  if (comment == undefined || comment == "") {
    console.log("please, add comment for commit");
  }
  local.commit(comment);
}

function vmtouch(file) {
  if (file == undefined || file == "") {
    console.log("please, input filename");
  }
  local.touch(file);
}

function vmlog() {
  local.log();
}

function vmpush() {
  remote.push(local.currentRepo());
}
