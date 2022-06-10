#!/usr/bin/node
const fs = require("fs");
const path = require("path");
const { getSepkPem } = require("./pem");
const { getIdentityFromPem } = require("./pem");

var args = require("yargs/yargs")(process.argv.slice(2)).argv;
const key_path = path.parse(String(args.k));

if (key_path === undefined) {
  console.log("specify key with -k");
  process.exit(1);
}

let pem = fs.readFileSync(path.format(key_path)).toString();
getIdentityFromPem(pem).then((identity) => {
  console.log(identity);
  console.log(identity.getPrincipal().toText());
  let fixed_pem = getSepkPem(identity);
  console.log(fixed_pem);
  key_path.name = `${key_path.name}_fixed`;

  fs.writeFileSync("./fixed.pem", fixed_pem);
});
