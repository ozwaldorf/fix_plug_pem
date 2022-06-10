const { Secp256k1KeyIdentity } = require("@dfinity/identity");

const getIdentityFromPem = async (pem) => {
  pem = pem
    .replace(/(-{5}.*-{5})/g, "")
    .replace("BgUrgQQACg==", "")
    .replace("\n", "")
    .trim();

  const raw = Buffer.from(pem, "base64")
    .toString("hex")
    .replace(
      "308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420",
      ""
    )
    .replace("a144034200")
    .replace("3053020101300506032b657004220420", "")
    .replace("a123032100", "")
    .replace("30740201010420", "")
    .replace("a00706052b8104000aa144034200", "");

  const key = new Uint8Array(Buffer.from(raw.substring(0, 64), "hex"));

  try {
    const identity = Secp256k1KeyIdentity.fromSecretKey(key);
    return identity;
  } catch {
    console.log("(e) Invalid key");
    process.exit(1);
  }
};

const PEM_BEGIN = `-----BEGIN EC PARAMETERS-----
BgUrgQQACg==
-----END EC PARAMETERS-----
-----BEGIN EC PRIVATE KEY-----`;

const PEM_END = "-----END EC PRIVATE KEY-----";

const PRIV_KEY_INIT = "30740201010420";

const KEY_SEPARATOR = "a00706052b8104000aa144034200";

const getSepkPem = (identity) => {
  const keypair = identity.getKeyPair();
  const rawPrivateKey = Buffer.from(keypair.secretKey).toString("hex");
  const rawPublicKey = Buffer.from(keypair.publicKey.rawKey).toString("hex");

  return `${PEM_BEGIN}\n${Buffer.from(
    `${PRIV_KEY_INIT}${rawPrivateKey}${KEY_SEPARATOR}${rawPublicKey}`,
    "hex"
  ).toString("base64")}\n${PEM_END}`;
};

exports.getIdentityFromPem = getIdentityFromPem;
exports.getSepkPem = getSepkPem;
