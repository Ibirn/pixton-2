## Recovery.js

A simple node application intended to extract a valid jpeg from a provided corrupted file.

Unfortunately, in keeping with the 24 hour window, I was unable to successfully complete this project.

We DO output a jpeg, but the data is still scrambled and the image is unusable. Further explanation is provided below.

### Use

1. Clone the git repo with your preferred method.
2. Change to the root directory of the repo.
3. Either run `npm install` or `yarn install`
4. In your terminal run `node recovery.js <path to corrupted file> <path to output file>`

### Example

This command will look for `corrupted-image` in the `./test` directory, and output a `output.jpg` file in the current directory.

```
node recover.js ./test/corrupted-image .
```

## Takeaways and Process

I'd never had to approach something like this before, so I ran into a few issues, but I still enjoyed the challenge.

Firstly, the obvious problem with the corrupted image is that it's size is 4GB, which would crush the memory in those poor old Macbooks that Bill refuses to replace. As such, simply reading the file and sorting the data wouldn't work (I tried once for fun and had to give in and kill the process), so I resorted to using `filesystem` to create data streams that would be easier to work with for the computer.

Conveniently, since the data was in utf8, scanning for the pixel values in the stream wasn't too difficult. A regex search was used to return all instances of 9 consecutive numbers in each chunk of data streamed, which were then broken into individual arrays of 3 numbers representing the RGB values of the pixel.

The real issue came with reassembling the data. I had never had to use the `sharp` package itself before, though I've seen it as a dependancy in other packages and apps before.

I had a great deal of difficulty (and ultimately failed) to find a successful way to stream the raw data into a jpeg image. The documentation for the `sharp` package was a bit lackluster, and I had to experiment quite a lot to get as far as I could.

This included learning about jpeg headers and attempting to set them myself which resulted in a 2px x 6px image no matter what I did. The no-longer in use headers are below, just to show my work. Some of these numbers were taken from a 200x200px square image I created to examine headers. I arrived at 200px x 200px because you mentioned it's square and counting the number of regex hits for pixels.

```
    const magicNumbers = Uint8Array.from([255, 216]);
    const markerLength = Uint8Array.from([255, 224, 0, 16]);
    const identifier = Uint8Array.from([74, 70, 73, 70, 0]);
    const version = Uint8Array.from([1, 1]);
    const units = Uint8Array.from([0]);
    const density = Uint8Array.from([0, 200, 0, 200]);
    const thumbnail = Uint8Array.from([0, 0]);
    const startFrame = Uint8Array.from([
      255, 192, 0, 17, 8, 0, 2, 0, 6, 3, 1, 34, 0, 2, 17, 1, 3, 17, 1,
    ]);
    const startScan = Uint8Array.from([
      255, 218, 0, 12, 3, 1, 0, 2, 17, 3, 17, 0, 63, 0,
    ]);
    const quantizationTable1 = Uint8Array.from([
      255, 219, 0, 67, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ]);
    const quantizationTable2 = Uint8Array.from([
      255, 219, 0, 67, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ]);
```

It was a bit of a nightmare, trying to go about it that way.

I did as much digging on Stack Overflow and in the github repo for sharp as I could after exhausting the docs, but I couldn't find a good way to combine the two examples of constructing an image from raw pixel data and also receiving a stream.

This is definitely a situation where in a work environment, I'd have had to pull someone else in to assist me. It's a little frustrating because as I continued to adjust and iterate I managed to get the image to export into a 'valid' jpeg in that it IS a jpeg when examined with `file` in the terminal and `xxd` shows that it has the correct SOI and EOI markers but is clearly not what is expected.

And I know that this image is 'irrecoverable', but I have some good news for Bob - I'm pretty sure it's the Pixton logo based on the colour of the pixels, and I think we can another somewhere.
