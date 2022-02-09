const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $(".player");
const repeat = $(".btn-repeat");
const progress = $('#progress');
const next = $(".btn-next");
const prev = $(".btn-prev");
const random = $('.btn-random');
var allSong;

const app = {
  currentIndex : 0,
  isPlaying : false,
  isRepeat : false,
  isRandom : false,
  songs: [
    {
      name: "Nevada",
      singer: "Raftaar x Fortnite",
      path: "./audio/Nevada.mp3",
      image: "https://climateaction.nv.gov/wp-content/uploads/2020/08/homepage-las-vegas-slide.jpg",
    },
    {
      name: "Linked",
      singer: "Jim Yosef x Anna Yvette",
      path: "./audio/Linked - Jim Yosef_ Anna Yvette.mp3",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg",
    },
    {
      name: "Here At Last",
      singer: "William Black x Rico_ Miel",
      path: "./audio/Here At Last - William Black_ Rico_ Miel.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
    },
    {
      name: "Against The Current",
      singer: "Mako x Alan Walker",
      path: "./audio/Against The Current, Mako, Alan Walker.mp3",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg",
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",
      path: "./audio/DapAnCuaBanRemix-DJ.mp3",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg",
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "./audio/Safe And Sound - Different Heaven.mp3",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
    },
    {
      name: "Mantoiyat",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "./audio/Walk Thru Fire - Vicetone_ Meron Ryan.mp3",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg",
    },
    {
      name: "Naachne Ka Shaunq",
      singer: "Raftaar x Brobha V",
      path: "./audio/Here At Last - William Black_ Rico_ Miel.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
    },
  ],
  render: function() {
    const self = this;
    const html = this.songs.map((item,index) => {
      return `
        <div class="song ${index === this.currentIndex ? 'active':''}">
          <div class="thumb"
              style="background-image: url('${item.image}')">
          </div>
          <div class="body">
              <h3 class="title">${item.name}</h3>
              <p class="author">${item.singer}</p>
          </div>
          <div class="option">
              <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
      `
    }).join('');
    $('.playlist').innerHTML = html;
    allSong = $$('.song');
    allSong.forEach((item, index) => {
      item.addEventListener('click', () => {
        allSong[this.currentIndex].classList.remove('active');
        item.classList.add('active');
        self.currentIndex = index;
        self.loadCurrentSong();
        audio.play();
      });
    })
  },
  defineProperties: function() {
    Object.defineProperty(this,'currentSong',{
      get: function() {
        return this.songs[this.currentIndex];
      }
    })
  },
  handleEvents: function() {
    const self = this;
    const cdWidth = cd.offsetWidth;
    // scale Cd
    document.onscroll = function() {
      let scrollTop = document.documentElement.scrollTop || window.scrollY;
      let newWidth = cdWidth - parseInt(scrollTop);
      cd.style.width = newWidth > 0 ?  newWidth  + 'px' : 0;
      cd.style.opacity = newWidth / cdWidth;
    }
    // cd rotate
    const cdThumbRotation = cdThumb.animate([
      { transform: 'rotate(360deg)' },
    ],{
      duration: 15000,// 10 seconds
      iterations: Infinity,
    })
    cdThumbRotation.pause();
    // play song
    playBtn.onclick = function() {
      if(self.isPlaying) 
        audio.pause();
      else
        audio.play();
    }
    audio.onplay = function() {
      player.classList.add('playing');
      self.isPlaying = true;
      cdThumbRotation.play();
    }
    // when pause
    audio.onpause = function() {
      player.classList.remove('playing');
      self.isPlaying = false;
      cdThumbRotation.pause();
    }
    // when song change
    audio.ontimeupdate = function() {
      let currentTime = audio.currentTime;
      let duration = audio.duration;
      let percent = (currentTime / duration) * 100;
      progress.value = percent;
    }
    // tua
    progress.onchange = function(e) {
      let percent = (e.target.value / 100) * audio.duration;
      audio.currentTime = percent;
    }
    repeat.onclick = function() {
      self.isRepeat = !self.isRepeat;
      if(self.isRepeat) {
        repeat.classList.add('active');
        audio.loop = true;
      } else {
        repeat.classList.remove('active');
        audio.loop = false;
      }
    }
    random.onclick = function() {
      self.isRandom = !self.isRandom;
      random.classList.toggle('active',self.isRandom);
    }
    next.onclick = function() {
      if(self.isRandom) {
        self.playRandomSong();
      }
      else{
        self.nextSong();
      }
      audio.play();
      self.render();
    }
    prev.onclick = function() {
      if(self.isRandom) {
        self.playRandomSong();
      }
      else{
        self.prevSong();
      }
      audio.play();
      self.render();
    }
    audio.onended = function() {
      if(self.isRepeat) {
        audio.play();
      } else {
        next.click();
      }
    }
  },
  loadCurrentSong: function() {
    heading.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function() {
    if(this.isRepeat) {
      this.currentIndex = 0;
      this.loadCurrentSong();
      return;
    }
    if(this.currentIndex === this.songs.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
    this.loadCurrentSong();
  },
  prevSong: function() {
    if(this.isRepeat) {
      this.currentIndex = 0;
      this.loadCurrentSong();
      return;
    }
    if(this.currentIndex === 0) {
      this.currentIndex = this.songs.length - 1;
    } else {
      this.currentIndex--;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function() {
    var newIndex = this.currentIndex;
    do{
      newIndex = Math.floor(Math.random() * this.songs.length);
    }while(newIndex===this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    this.defineProperties();
    this.handleEvents();
    this.loadCurrentSong();
    this.render();
  },
};

app.start(); // start the app
