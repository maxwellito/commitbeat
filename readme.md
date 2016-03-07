# CommitBeat

Generate small sequence of music from commit SHA.

Demo available on [maxwellito.github.io/commitbeat](http://maxwellito.github.io/commitbeat)

## Why?

This is a stupid experiment like many others, to make music from an existing source of data. It was mainly inspired from the Yamaha's Tenori-on. To make it more interesting, the script is using different sources of sounds: the Tenori-on and the TR-808. This make me realised that I'm absolutely sh**e at music and the music generated is closer to terrible noise than poppy music. So if you're a zicos, please help. *(Yes, that's a desperate call)*.

About technologies you will mention no AngularJS, no React, no Webpack, no Backbone, no jQuery, no Gulp or Grunt, no package.json, no MAKE file, no requireJS, no tests, no unicorns, no Peter Griffin no here no... WHAAAAAAT!??

Let's face it for two seconds: this is a very small app and a fun experiment. Do I really need a bloody heavy framework to update the `textContent` of a DOM element?? *(Spoiler alert: NO!)*

## How's the hash is splitted?

Here is a hash : `169feb2702632459cb0eb37bf24a20e1d840f78c`

```
169feb2702632459cb0eb37bf24a20e1d840f78c
--                                       BPM
  --                                     Instruments
    ----                                 ???
        -------------------------------- Grid
```

### BPM

The BPM is on 2 hex, it's converted to integer then add to 60. Making the range from 60 to 315.

### Instruments

There is 2 different maps of instruments: the Tenori-on and the TR808. Each map contain 8 notes, but there's only 8 channels, this is why the code make a mix of both. The mix is made from 2 hex, if `0` the note will be the Tenori, if `1` the note will be the TR808.

### ???

Open to suggestions

### Grid

The grid is similar to the Tenori-on one, but with only 8 different channels. To generate it, it will use the last 32 hex. Once splitted into chunks of 4 hex, each of em will define the pattern of each channel.


## License

As you can see there's no `LICENSE.md` because I'm not really sure about the rights to use these sounds. But about the code, feel free to fork it or whatever.
