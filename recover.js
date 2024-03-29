const fs = require("fs");
const sharp = require("sharp");
const args = process.argv;

const recover = (src, dest) => {
  //print help if incorrect number of arguments are passed
  function printHelp() {
    console.log(
      "please format your request as:\nnode recover.js <location of source file> <destination directory>"
    );
  }
  if (args.length < 4 || args.length > 4) {
    printHelp();
    return;
  }

  //create a readable stream from the file, encode as utf8
  const readableStream = fs.createReadStream(src, { encoding: "utf8" });

  //create a writable stream to the destination file
  const writableStream = fs.createWriteStream(`${dest}/output.jpg`);

  //create a sharp instance to convert the readable stream to a jpg
  const writable = sharp({
    raw: {
      width: 200,
      height: 200,
      channels: 3,
    },
  });

  writable
    .toBuffer((err, data, info) => {
      if (err) {
        console.log(err);
      }
      writableStream.write(data);
      console.timeEnd("recovery time");
    })
    .jpeg();

  //pipe the readable stream to the sharp instance
  readableStream.pipe(writable);

  readableStream.on("open", () => {
    //begin timer
    console.time("recovery time");
  });

  readableStream.on("data", (chunk) => {
    //extract all instances of 9 contiguous numbers
    const regex = /\d{9}/g;
    const matches = chunk.match(regex);

    //break string of 9 number into rgb channels
    const rgbChannels = matches?.map((match) => {
      if (match.length === 9) {
        const red = match.slice(0, 3);
        const green = match.slice(3, 6);
        const blue = match.slice(6, 9);
        return Uint8Array.from([Number(red), Number(green), Number(blue)]);
      }
    });

    //push each match to sharp as a uint8array
    rgbChannels?.forEach((match) => {
      if (match.length === 3) {
        // i++;
        // console.log(match);
        // writableStream.write(match);
        writable.push(match);
      }
    });
  });
};

//run the function
recover(args[2], args[3]);
