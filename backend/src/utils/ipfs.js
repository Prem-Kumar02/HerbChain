// utils/ipfs.js
// Simple mock to simulate uploading to IPFS.
// Replace with real ipfs-http-client / Pinata code later.

export const mockUploadToIpfs = async (fileBuffer, filename) => {
  // pseudo CID: this is not real — replace in real integration
  const pseudo =
    "Qm" +
    Buffer.from(filename + Date.now())
      .toString("base64")
      .slice(0, 20);
  return { cid: pseudo, url: `https://ipfs.io/ipfs/${pseudo}` };
};
